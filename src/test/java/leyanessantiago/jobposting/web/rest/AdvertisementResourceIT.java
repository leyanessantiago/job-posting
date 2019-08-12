package leyanessantiago.jobposting.web.rest;

import leyanessantiago.jobposting.JobpostingApp;
import leyanessantiago.jobposting.domain.Advertisement;
import leyanessantiago.jobposting.domain.Profession;
import leyanessantiago.jobposting.domain.User;
import leyanessantiago.jobposting.repository.AdvertisementRepository;
import leyanessantiago.jobposting.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;

import static leyanessantiago.jobposting.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link AdvertisementResource} REST controller.
 */
@SpringBootTest(classes = JobpostingApp.class)
public class AdvertisementResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    @Autowired
    private AdvertisementRepository advertisementRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restAdvertisementMockMvc;

    private Advertisement advertisement;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AdvertisementResource advertisementResource = new AdvertisementResource(advertisementRepository);
        this.restAdvertisementMockMvc = MockMvcBuilders.standaloneSetup(advertisementResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Advertisement createEntity(EntityManager em) {
        Advertisement advertisement = new Advertisement()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .active(DEFAULT_ACTIVE);
        // Add required entity
        Profession profession;
        if (TestUtil.findAll(em, Profession.class).isEmpty()) {
            profession = ProfessionResourceIT.createEntity(em);
            em.persist(profession);
            em.flush();
        } else {
            profession = TestUtil.findAll(em, Profession.class).get(0);
        }
        advertisement.setProfession(profession);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        advertisement.setUser(user);
        return advertisement;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Advertisement createUpdatedEntity(EntityManager em) {
        Advertisement advertisement = new Advertisement()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .active(UPDATED_ACTIVE);
        // Add required entity
        Profession profession;
        if (TestUtil.findAll(em, Profession.class).isEmpty()) {
            profession = ProfessionResourceIT.createUpdatedEntity(em);
            em.persist(profession);
            em.flush();
        } else {
            profession = TestUtil.findAll(em, Profession.class).get(0);
        }
        advertisement.setProfession(profession);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        advertisement.setUser(user);
        return advertisement;
    }

    @BeforeEach
    public void initTest() {
        advertisement = createEntity(em);
    }

    @Test
    @Transactional
    public void createAdvertisement() throws Exception {
        int databaseSizeBeforeCreate = advertisementRepository.findAll().size();

        // Create the Advertisement
        restAdvertisementMockMvc.perform(post("/api/advertisements")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(advertisement)))
            .andExpect(status().isCreated());

        // Validate the Advertisement in the database
        List<Advertisement> advertisementList = advertisementRepository.findAll();
        assertThat(advertisementList).hasSize(databaseSizeBeforeCreate + 1);
        Advertisement testAdvertisement = advertisementList.get(advertisementList.size() - 1);
        assertThat(testAdvertisement.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testAdvertisement.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testAdvertisement.isActive()).isEqualTo(DEFAULT_ACTIVE);
    }

    @Test
    @Transactional
    public void createAdvertisementWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = advertisementRepository.findAll().size();

        // Create the Advertisement with an existing ID
        advertisement.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAdvertisementMockMvc.perform(post("/api/advertisements")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(advertisement)))
            .andExpect(status().isBadRequest());

        // Validate the Advertisement in the database
        List<Advertisement> advertisementList = advertisementRepository.findAll();
        assertThat(advertisementList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = advertisementRepository.findAll().size();
        // set the field null
        advertisement.setTitle(null);

        // Create the Advertisement, which fails.

        restAdvertisementMockMvc.perform(post("/api/advertisements")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(advertisement)))
            .andExpect(status().isBadRequest());

        List<Advertisement> advertisementList = advertisementRepository.findAll();
        assertThat(advertisementList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = advertisementRepository.findAll().size();
        // set the field null
        advertisement.setDescription(null);

        // Create the Advertisement, which fails.

        restAdvertisementMockMvc.perform(post("/api/advertisements")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(advertisement)))
            .andExpect(status().isBadRequest());

        List<Advertisement> advertisementList = advertisementRepository.findAll();
        assertThat(advertisementList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllAdvertisements() throws Exception {
        // Initialize the database
        advertisementRepository.saveAndFlush(advertisement);

        // Get all the advertisementList
        restAdvertisementMockMvc.perform(get("/api/advertisements?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(advertisement.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getAdvertisement() throws Exception {
        // Initialize the database
        advertisementRepository.saveAndFlush(advertisement);

        // Get the advertisement
        restAdvertisementMockMvc.perform(get("/api/advertisements/{id}", advertisement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(advertisement.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingAdvertisement() throws Exception {
        // Get the advertisement
        restAdvertisementMockMvc.perform(get("/api/advertisements/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAdvertisement() throws Exception {
        // Initialize the database
        advertisementRepository.saveAndFlush(advertisement);

        int databaseSizeBeforeUpdate = advertisementRepository.findAll().size();

        // Update the advertisement
        Advertisement updatedAdvertisement = advertisementRepository.findById(advertisement.getId()).get();
        // Disconnect from session so that the updates on updatedAdvertisement are not directly saved in db
        em.detach(updatedAdvertisement);
        updatedAdvertisement
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .active(UPDATED_ACTIVE);

        restAdvertisementMockMvc.perform(put("/api/advertisements")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAdvertisement)))
            .andExpect(status().isOk());

        // Validate the Advertisement in the database
        List<Advertisement> advertisementList = advertisementRepository.findAll();
        assertThat(advertisementList).hasSize(databaseSizeBeforeUpdate);
        Advertisement testAdvertisement = advertisementList.get(advertisementList.size() - 1);
        assertThat(testAdvertisement.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testAdvertisement.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testAdvertisement.isActive()).isEqualTo(UPDATED_ACTIVE);
    }

    @Test
    @Transactional
    public void updateNonExistingAdvertisement() throws Exception {
        int databaseSizeBeforeUpdate = advertisementRepository.findAll().size();

        // Create the Advertisement

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdvertisementMockMvc.perform(put("/api/advertisements")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(advertisement)))
            .andExpect(status().isBadRequest());

        // Validate the Advertisement in the database
        List<Advertisement> advertisementList = advertisementRepository.findAll();
        assertThat(advertisementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteAdvertisement() throws Exception {
        // Initialize the database
        advertisementRepository.saveAndFlush(advertisement);

        int databaseSizeBeforeDelete = advertisementRepository.findAll().size();

        // Delete the advertisement
        restAdvertisementMockMvc.perform(delete("/api/advertisements/{id}", advertisement.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Advertisement> advertisementList = advertisementRepository.findAll();
        assertThat(advertisementList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Advertisement.class);
        Advertisement advertisement1 = new Advertisement();
        advertisement1.setId(1L);
        Advertisement advertisement2 = new Advertisement();
        advertisement2.setId(advertisement1.getId());
        assertThat(advertisement1).isEqualTo(advertisement2);
        advertisement2.setId(2L);
        assertThat(advertisement1).isNotEqualTo(advertisement2);
        advertisement1.setId(null);
        assertThat(advertisement1).isNotEqualTo(advertisement2);
    }
}
