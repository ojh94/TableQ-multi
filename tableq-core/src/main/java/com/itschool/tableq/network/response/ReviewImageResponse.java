package com.itschool.tableq.network.response;

import com.itschool.tableq.domain.ReviewImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class ReviewImageResponse {
    private Long id;

    private String filename;

    private String path;

    private Long reviewId;

    public ReviewImageResponse(ReviewImage reviewImage){
        this.filename = reviewImage.getFilename();
        this.path = reviewImage.getPath();
        this.reviewId = reviewImage.getReview().getId();
    }
}
