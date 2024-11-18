package com.itschool.tableq.network.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReservationRequest {
    private Long id;
    private Integer reservationNumber;
    private Boolean isEntered;
    private LocalDateTime createdAt;
    private LocalDateTime lastModifiedAt;
    private Integer people;
    private Long restaurantId;
    private Long userId;
}
