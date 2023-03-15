package bf5.betting.entity.jpa;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * @author duynguyen
 **/
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "Player")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Player {
    @Id
    private String playerId;
    @Column
    private String playerName;
    @Column
    private String avatarUrl;
    @Column
    private long totalProfit;
}
