package leyanessantiago.jobposting.repository;

import leyanessantiago.jobposting.domain.Advertisement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Advertisement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AdvertisementRepository extends JpaRepository<Advertisement, Long> {

    @Query("select advertisement from Advertisement advertisement where advertisement.user.login = ?#{principal.username}")
    List<Advertisement> findByUserIsCurrentUser();

    @Query(value = "select advertisement from Advertisement advertisement where advertisement.user.login = ?#{principal.username}")
    Page<Advertisement> findByUserIsCurrentUser(Pageable pageable);

    @Query("select advertisement from Advertisement advertisement where advertisement.active = true")
    List<Advertisement> findByActiveIsActive();

    @Query("select count(advertisement) from Advertisement advertisement where advertisement.active = true and advertisement.user.login = ?#{principal.username}")
    Long countActiveByUserIsCurrentUser();

    @Query("select advertisement.profession.id, count(advertisement) from Advertisement advertisement where advertisement.active = true group by (advertisement.profession.id)")
    List<Object[]> countActiveByProfession();

    @Query("select advertisement.profession.id, count(advertisement) from Advertisement advertisement where advertisement.active = true and advertisement.user.login = ?#{principal.username} group by (advertisement.profession.id)")
    List<Object[]> countActiveByProfessionByUserIsCurrentUser();
}
