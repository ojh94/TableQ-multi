package com.itschool.tableq.network.request;

import lombok.*;
import org.hibernate.validator.constraints.URL;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MenuItemRequest {
    private Long id;

    private String name;

    private String price;

    private String description;

    @URL
    private String imageUrl;

    private Boolean recommendation;

    private Long restaurantId;
}
