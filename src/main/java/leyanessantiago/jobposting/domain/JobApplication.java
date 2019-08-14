package leyanessantiago.jobposting.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

/**
 * A JobApplication.
 */
@Entity
@Table(name = "job_application")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class JobApplication {

    @EmbeddedId
    JobApplicationKey id;

    @ManyToOne
    @MapsId("advertisement_id")
    @JoinColumn(name = "advertisement_id")
    Advertisement advertisement;

    @ManyToOne
    @MapsId("candidate_id")
    @JoinColumn(name = "candidate_id")
    Candidate candidate;
}
