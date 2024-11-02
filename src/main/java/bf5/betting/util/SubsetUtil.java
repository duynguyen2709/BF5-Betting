package bf5.betting.util;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author duynguyen
 **/
public class SubsetUtil {

  public static <T> List<List<T>> generateAllSubsets(List<T> elements) {
    return generateSubsets(elements).stream()
                                    .filter(subset -> subset.size() > 0)
                                    .collect(Collectors.toList());
  }

  public static <T> List<List<T>> generateSubsetOfSize(List<T> elements, int K) {
    return generateSubsets(elements).stream()
                                    .filter(subset -> subset.size() == K)
                                    .collect(Collectors.toList());
  }

  private static <T> List<List<T>> generateSubsets(List<T> elements) {
    int sz = elements.size();
    List<List<T>> combinations = new ArrayList<>();
    for (int mask = 0; mask < (1 << sz); mask++) {
      List<T> comb = new ArrayList<>();
      for (int pos = 0; pos < sz; pos++) {
        if ((mask & (1 << pos)) != 0) {
          comb.add(elements.get(pos));
        }
      }
      combinations.add(comb);
    }
    return combinations;
  }
}
