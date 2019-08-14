package leyanessantiago.jobposting.domain;

public class AdvertisementsByProfession {
    private String professionName;
    private Integer adsCount;

    public AdvertisementsByProfession() {}

    public AdvertisementsByProfession(String professionName, Integer adsCount) {
        this.professionName = professionName;
        this.adsCount = adsCount;
    }

    public String getProfessionName() {
        return professionName;
    }

    public void setProfessionName(String professionName) {
        this.professionName = professionName;
    }

    public Integer getAdsCount() {
        return adsCount;
    }

    public void setAdsCount(Integer adsCount) {
        this.adsCount = adsCount;
    }
}
