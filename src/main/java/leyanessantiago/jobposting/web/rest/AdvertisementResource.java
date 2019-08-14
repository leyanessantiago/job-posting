package leyanessantiago.jobposting.web.rest;

import leyanessantiago.jobposting.domain.AdvertisementsByProfession;
import leyanessantiago.jobposting.domain.Advertisement;
import leyanessantiago.jobposting.domain.Profession;
import leyanessantiago.jobposting.repository.AdvertisementRepository;
import leyanessantiago.jobposting.repository.ProfessionRepository;
import leyanessantiago.jobposting.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link leyanessantiago.jobposting.domain.Advertisement}.
 */
@RestController
@RequestMapping("/api")
public class AdvertisementResource {

    private final Logger log = LoggerFactory.getLogger(AdvertisementResource.class);

    private static final String ENTITY_NAME = "advertisement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AdvertisementRepository advertisementRepository;

    private final ProfessionRepository professionRepository;

    public AdvertisementResource(AdvertisementRepository advertisementRepository, ProfessionRepository professionRepository) {
        this.advertisementRepository = advertisementRepository;
        this.professionRepository = professionRepository;
    }

    /**
     * {@code POST  /advertisements} : Create a new advertisement.
     *
     * @param advertisement the advertisement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new advertisement, or with status {@code 400 (Bad Request)} if the advertisement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/advertisements")
    public ResponseEntity<Advertisement> createAdvertisement(@Valid @RequestBody Advertisement advertisement) throws URISyntaxException {
        log.debug("REST request to save Advertisement : {}", advertisement);
        if (advertisement.getId() != null) {
            throw new BadRequestAlertException("A new advertisement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Advertisement result = advertisementRepository.save(advertisement);
        return ResponseEntity.created(new URI("/api/advertisements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /advertisements} : Updates an existing advertisement.
     *
     * @param advertisement the advertisement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated advertisement,
     * or with status {@code 400 (Bad Request)} if the advertisement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the advertisement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/advertisements")
    public ResponseEntity<Advertisement> updateAdvertisement(@Valid @RequestBody Advertisement advertisement) throws URISyntaxException {
        log.debug("REST request to update Advertisement : {}", advertisement);
        if (advertisement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (advertisement.isActive()) {
            Optional<Advertisement> currentAdvertisement = advertisementRepository.findById(advertisement.getId());
            if (!currentAdvertisement.get().isActive()) {
                Long activeCount = advertisementRepository.countActiveByUserIsCurrentUser();
                if (activeCount >= 10) {
                    throw new BadRequestAlertException("You can only have 10 active advertisements", "Advertisement", "active");
                }
            }
        }
        Advertisement result = advertisementRepository.save(advertisement);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, advertisement.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /advertisements} : get all the advertisements.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of advertisements in body.
     */
    @GetMapping("/advertisements")
    public ResponseEntity<List<Advertisement>> getAllAdvertisements(Pageable pageable) {
        log.debug("REST request to get a page of Advertisements");
        Page<Advertisement> page = advertisementRepository.findByUserIsCurrentUser(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        Long activeCount = advertisementRepository.countActiveByUserIsCurrentUser();
        headers.add("X-Active-Count", activeCount.toString());
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /advertisements/active} : get all the active advertisements.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of active advertisements in body.
     */
    @GetMapping("/advertisements/active")
    public ResponseEntity<List<Advertisement>> getActiveAdvertisements() {
        log.debug("REST request to get the active Advertisements");
        List<Advertisement> activeAdvertisements = advertisementRepository.findByActiveIsActive();
        return ResponseEntity.ok().body(activeAdvertisements);
    }

    /**
     * {@code GET  /advertisements/by-profession} : get the advertisements count by profession.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the advertisements count by profession in body.
     */
    @GetMapping("/advertisements/by-profession")
    public ResponseEntity<List<AdvertisementsByProfession>> getAdvertisementsByProfession() {
        log.debug("REST request to get Advertisements count by profession");
        List<Object[]> advertisements = advertisementRepository.countByProfession();
        List<Profession> professions = professionRepository.findAll();
        List<AdvertisementsByProfession> advertisementsByProfession = new ArrayList<>();
        for (Object[] ads: advertisements) {
            AdvertisementsByProfession item = new AdvertisementsByProfession();
            item.setProfessionName(professions.stream().filter(p -> p.getId() == ads[0]).findFirst().get().getName());
            item.setAdsCount(Integer.parseInt(ads[1].toString()));
            advertisementsByProfession.add(item);
        }
        return ResponseEntity.ok().body(advertisementsByProfession);
    }

    /**
     * {@code GET  /advertisements/:id} : get the "id" advertisement.
     *
     * @param id the id of the advertisement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the advertisement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/advertisements/{id}")
    public ResponseEntity<Advertisement> getAdvertisement(@PathVariable Long id) {
        log.debug("REST request to get Advertisement : {}", id);
        Optional<Advertisement> advertisement = advertisementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(advertisement);
    }

    /**
     * {@code DELETE  /advertisements/:id} : delete the "id" advertisement.
     *
     * @param id the id of the advertisement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/advertisements/{id}")
    public ResponseEntity<Void> deleteAdvertisement(@PathVariable Long id) {
        log.debug("REST request to delete Advertisement : {}", id);
        advertisementRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
