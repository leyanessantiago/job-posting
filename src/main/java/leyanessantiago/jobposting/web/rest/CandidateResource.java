package leyanessantiago.jobposting.web.rest;

import leyanessantiago.jobposting.domain.*;
import leyanessantiago.jobposting.repository.CandidateRepository;
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
import java.util.Set;

/**
 * REST controller for managing {@link leyanessantiago.jobposting.domain.Candidate}.
 */
@RestController
@RequestMapping("/api")
public class CandidateResource {

    private final Logger log = LoggerFactory.getLogger(CandidateResource.class);

    private static final String ENTITY_NAME = "candidate";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CandidateRepository candidateRepository;

    private final ProfessionRepository professionRepository;

    public CandidateResource(CandidateRepository candidateRepository, ProfessionRepository professionRepository) {
        this.candidateRepository = candidateRepository;
        this.professionRepository = professionRepository;
    }

    /**
     * {@code POST  /candidates} : Create a new candidate.
     *
     * @param candidate the candidate to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new candidate, or with status {@code 400 (Bad Request)} if the candidate has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/candidates")
    public ResponseEntity<Candidate> createCandidate(@Valid @RequestBody Candidate candidate) throws URISyntaxException {
        log.debug("REST request to save Candidate : {}", candidate);
        if (candidate.getId() != null) {
            throw new BadRequestAlertException("A new candidate cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Candidate result;
        Candidate existentCandidate = candidateRepository.findByEmailWithEagerRelationships(candidate.getEmail());
        if (existentCandidate != null) {
            Candidate candidateToSave = existentCandidate;
            Boolean isChangingNames = !candidate.getFirstName().equals(candidateToSave.getFirstName())
                || !candidate.getLastName().equals(candidateToSave.getLastName());
            if (isChangingNames) {
                throw new BadRequestAlertException("A candidate with the same email already exists, If you have any question please contact with the admin", "Candidate", "email");
            }
            Advertisement advertisement = candidate.getAdvertisements().stream().findFirst().get();
            Boolean hasThisAdvertisement = existentCandidate.getAdvertisements().stream().anyMatch(ads -> ads.getId() == advertisement.getId());
            if (hasThisAdvertisement) {
                throw new BadRequestAlertException("You can only apply once for each advertisement", "Job Application", "jobApplication");
            }
            Set<Advertisement> adsToSave = candidateToSave.getAdvertisements();
            adsToSave.addAll(candidate.getAdvertisements());
            candidateToSave.setAdvertisements(adsToSave);
            result = candidateRepository.save(candidateToSave);
        } else {
            result = candidateRepository.save(candidate);
        }
        return ResponseEntity.created(new URI("/api/candidates/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /candidates} : Updates an existing candidate.
     *
     * @param candidate the candidate to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated candidate,
     * or with status {@code 400 (Bad Request)} if the candidate is not valid,
     * or with status {@code 500 (Internal Server Error)} if the candidate couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/candidates")
    public ResponseEntity<Candidate> updateCandidate(@Valid @RequestBody Candidate candidate) throws URISyntaxException {
        log.debug("REST request to update Candidate : {}", candidate);
        if (candidate.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Candidate result = candidateRepository.save(candidate);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, candidate.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /candidates} : get all the candidates.
     *

     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of candidates in body.
     */
    @GetMapping("/candidates")
    public ResponseEntity<List<Candidate>> getAllCandidates(Pageable pageable, @RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get a page of Candidates");
        Page<Candidate> page;
        if (eagerload) {
            page = candidateRepository.findAllWithEagerRelationships(pageable);
        } else {
            page = candidateRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /candidates/by-profession} : get the candidates count by profession.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the candidates count by profession in body.
     */
    @GetMapping("/candidates/by-profession")
    public ResponseEntity<List<CandidatesByProfession>> getCandidatesByProfession() {
        log.debug("REST request to get Candidates count by profession");
        List<Object[]> candidates = candidateRepository.countByProfession();
        List<Profession> professions = professionRepository.findAll();
        List<CandidatesByProfession> candidatesByProfession = new ArrayList<>();
        for (Object[] ads: candidates) {
            CandidatesByProfession item = new CandidatesByProfession();
            item.setProfessionName(professions.stream().filter(p -> p.getId() == ads[0]).findFirst().get().getName());
            item.setCandidatesCount(Integer.parseInt(ads[1].toString()));
            candidatesByProfession.add(item);
        }
        return ResponseEntity.ok().body(candidatesByProfession);
    }

    /**
     * {@code GET  /candidates/:id} : get the "id" candidate.
     *
     * @param id the id of the candidate to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the candidate, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/candidates/{id}")
    public ResponseEntity<Candidate> getCandidate(@PathVariable Long id) {
        log.debug("REST request to get Candidate : {}", id);
        Optional<Candidate> candidate = candidateRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(candidate);
    }

    /**
     * {@code DELETE  /candidates/:id} : delete the "id" candidate.
     *
     * @param id the id of the candidate to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/candidates/{id}")
    public ResponseEntity<Void> deleteCandidate(@PathVariable Long id) {
        log.debug("REST request to delete Candidate : {}", id);
        candidateRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
