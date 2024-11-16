package bf5.betting.repository;

import bf5.betting.entity.jpa.ServerConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author duynguyen
 */
@Repository
public interface ServerConfigRepository extends JpaRepository<ServerConfig, String> {

}
