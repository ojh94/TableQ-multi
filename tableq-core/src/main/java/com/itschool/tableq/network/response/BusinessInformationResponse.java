package com.itschool.tableq.network.response;

import com.itschool.tableq.domain.BusinessInformation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class BusinessInformationResponse {
    private Long id;

    private String businessNumber;

    private String businessName;

    private String contactNumber;

    private Long ownerId;

    public BusinessInformationResponse(BusinessInformation businessInformation) {
        this.id = businessInformation.getId();
        this.businessNumber = businessInformation.getBusinessNumber();
        this.businessName = businessInformation.getBusinessName();
        this.contactNumber = businessInformation.getContactNumber();
        this.ownerId = businessInformation.getOwner().getId();
    }
}
