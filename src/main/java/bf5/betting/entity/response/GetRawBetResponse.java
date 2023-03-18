package bf5.betting.entity.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * @author duynguyen
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetRawBetResponse implements Serializable {
    private boolean success;
    private RawBetResponseData data;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RawBetResponseData implements Serializable {
        private List<RawBetEntity> bets;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RawBetEntity implements Serializable {
        private long id; // betID
        private long date; // date * 1000 = betTime
        private double coef; // ratio
        private int status;
        private long sum; // betAmount
        @JsonProperty("win_sum")
        private Long winSum; // actualProfit
        @JsonProperty("possible_win_sum")
        private Long possibleWinSum; // possibleWinSum - sum = potentialProfit
        private List<RawBetEvent> events;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RawBetEvent implements Serializable {
        @JsonProperty("event_type_title")
        private String eventTypeTitle; // event
        @JsonProperty("game_start_date")
        private long gameStartDate; // gameStartDate * 1000 = matchTime
        @JsonProperty("champ_name")
        private String champName; // tournamentName
        @JsonProperty("period_name")
        private String periodName; // periodName == '1 Half' => firstHalfOnly = true
        private double coef;
        private String score;
        @JsonProperty("is_finished")
        private Boolean isFinished;
        @JsonProperty("opp1_name")
        private String opp1Name;
        @JsonProperty("opp1_images")
        private List<String> opp1Images;
        @JsonProperty("opp2_name")
        private String opp2Name;
        @JsonProperty("opp2_images")
        private List<String> opp2Images;
    }
}

/*
{
    "success": true,
    "data": {
        "bets": [
            {
                "id": 35597294775,
                "date": 1679112251,
                "coef": 1.93,
                "coef_view": "1.93",
                "status": 1,
                "type": 0,
                "type_title": "Single",
                "system_type": 1,
                "formatted_system_type": null,
                "can_be_returned": false,
                "can_sell": true,
                "can_insure": true,
                "can_print": true,
                "can_show_sale_logs": false,
                "is_used_promo_code": false,
                "currency_code": "VND",
                "sum": 20000,
                "win_sum": null,
                "win_sum_with_tax": null,
                "possible_win_sum": 38600,
                "possible_win_sum_with_tax": null,
                "payout_sum": null,
                "max_payout": null,
                "out_sum": null,
                "to_prepayment_sum": null,
                "prepayment_sum": null,
                "closed_prepayment_sum": null,
                "old_sale_sum": null,
                "auto_sale_sum": null,
                "cashout_sum": null,
                "insurance_sum": null,
                "insurance_percent": null,
                "insurance_status": null,
                "max_sum_increasing_request_status": null,
                "auto_sale_status": null,
                "skks_hash": null,
                "has_alternative_info": false,
                "events": [
                    {
                        "additional_game_info": "",
                        "calculation_date": null,
                        "event_type_id": 3828,
                        "event_type_title": "Total Under (2.25)",
                        "event_type_small_group_id": 1007,
                        "event_type_small_group_name": "Asian Total",
                        "game_start_date": 1679115600,
                        "sport_id": 1,
                        "sport_name": "Football",
                        "sport_name_en": null,
                        "champ_id": 118737,
                        "champ_name": "Japan. J-League",
                        "champ_name_en": null,
                        "champ_image": null,
                        "main_game_id": 439056433,
                        "const_id": 163675580,
                        "game_id": 439056433,
                        "game_name": "Yokohama - Kyoto Sanga",
                        "game_kind": null,
                        "game_status": 2,
                        "game_type_title": null,
                        "game_vid_title": null,
                        "period_name": "",
                        "is_home_away_game": false,
                        "is_live_game_in_live": true,
                        "live_game_time_sec": null,
                        "coef": 1.93,
                        "coef_view": "1.93",
                        "score": null,
                        "is_score_json": false,
                        "result_type": null,
                        "returned_bet_event_status_id": null,
                        "returned_bet_event_status_name": null,
                        "returned_bet_event_reason_name": null,
                        "is_finished": false,
                        "player_name": null,
                        "opp1_id": 12207,
                        "opp1_name": "Yokohama",
                        "opp1_name_en": null,
                        "opp1_images": [
                            "12207.png"
                        ],
                        "opp2_id": 12213,
                        "opp2_name": "Kyoto Sanga",
                        "opp2_name_en": null,
                        "opp2_images": [
                            "22a84c3215cbb11b4f56e6083a97d353.png"
                        ],
                        "block_level": null,
                        "block_sum": null,
                        "block_coef": null,
                        "block_result": null,
                        "statId": "63ca6fed94fca712b4f65d74",
                        "has_translation": false,
                        "translation_id": null,
                        "is_cyber": false
                    }
                ],
                "taxBet": null
            }
        ]
    }
}
 */