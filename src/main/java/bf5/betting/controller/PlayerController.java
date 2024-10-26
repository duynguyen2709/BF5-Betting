package bf5.betting.controller;

import bf5.betting.entity.jpa.Player;
import bf5.betting.entity.response.BaseResponse;
import bf5.betting.service.PlayerService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * @author duynguyen
 **/
@RestController
@RequestMapping("/api/players")
@AllArgsConstructor
public class PlayerController {

  private final PlayerService playerService;

  @GetMapping("")
  public BaseResponse<Map<String, Player>> getAll() {
    return BaseResponse.success(playerService.getAllPlayer());
  }
}
