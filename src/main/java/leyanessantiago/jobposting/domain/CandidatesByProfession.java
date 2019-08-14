package leyanessantiago.jobposting.domain;

public class CandidatesByProfession {
    private String professionName;
    private Integer candidatesCount;

    public CandidatesByProfession() {}

    public CandidatesByProfession(String professionName, Integer candidatesCount) {
        this.professionName = professionName;
        this.candidatesCount = candidatesCount;
    }

    public String getProfessionName() {
        return professionName;
    }

    public void setProfessionName(String professionName) {
        this.professionName = professionName;
    }

    public Integer getCandidatesCount() {
        return candidatesCount;
    }

    public void setCandidatesCount(Integer candidatesCount) {
        this.candidatesCount = candidatesCount;
    }
}
