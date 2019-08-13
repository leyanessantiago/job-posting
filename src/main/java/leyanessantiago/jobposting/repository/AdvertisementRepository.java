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

    @Query(value = "select advertisement from Advertisement advertisement where advertisement.user.login = ?#{principal.username}",
        countQuery = "select count(distinct advertisement) from Advertisement advertisement")
    Page<Advertisement> findByUserIsCurrentUser(Pageable pageable);

    @Query("select advertisement from Advertisement advertisement where advertisement.active = true")
    List<Advertisement> findByActiveIsActive();
}
