package leyanessantiago.jobposting.repository;

import leyanessantiago.jobposting.domain.Candidate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Candidate entity.
 */
@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    @Query(value = "select distinct candidate from Candidate candidate left join fetch candidate.advertisements",
        countQuery = "select count(distinct candidate) from Candidate candidate")
    Page<Candidate> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct candidate from Candidate candidate left join fetch candidate.advertisements")
    List<Candidate> findAllWithEagerRelationships();

    @Query("select candidate from Candidate candidate left join fetch candidate.advertisements where candidate.id =:id")
    Optional<Candidate> findOneWithEagerRelationships(@Param("id") Long id);

    @Query("select candidate from Candidate candidate left join fetch candidate.advertisements where candidate.email =:email")
    Candidate findByEmailWithEagerRelationships(@Param("email") String email);

    @Query("select advertisement.profession.id, count(jobApplication.candidate.id) from JobApplication jobApplication, Advertisement advertisement WHERE jobApplication.advertisement.id = advertisement.id group by (advertisement.profession.id)")
    List<Object[]> countByProfession();

}
