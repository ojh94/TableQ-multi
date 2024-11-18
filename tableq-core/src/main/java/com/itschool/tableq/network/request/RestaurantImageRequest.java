package com.itschool.tableq.network.request;

import com.itschool.tableq.domain.Restaurant;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class RestaurantImageRequest {
    private Long id;

    private String filename;

    private String path;

    private Restaurant restaurant;
}


