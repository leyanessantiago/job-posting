package leyanessantiago.jobposting.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class JobApplicationKey implements Serializable {

    @Column(name = "advertisement_id")
    Long advertisementId;

    @Column(name = "candidate_id")
    Long candidateId;
}
