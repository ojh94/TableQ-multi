package com.itschool.tableq.network.request;

import com.itschool.tableq.domain.BusinessInformation;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class RestaurantRequest {
    private Long id;

    private String name;

    private String address;

    private String introduction;

    private String contact_number;

    private boolean isAvailable;

    private BusinessInformation businessInformation;
}
