package com.itschool.tableq.service;

import com.itschool.tableq.domain.Restaurant;
import com.itschool.tableq.domain.RestaurantImage;
import com.itschool.tableq.network.Header;
import com.itschool.tableq.network.Pagination;
import com.itschool.tableq.network.request.RestaurantImageRequest;
import com.itschool.tableq.network.response.RestaurantImageResponse;
import com.itschool.tableq.repository.RestaurantImageRepository;
import com.itschool.tableq.repository.RestaurantRepository;
import com.itschool.tableq.service.base.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class RestaurantImageService extends
        BaseService<RestaurantImageRequest, RestaurantImageResponse, RestaurantImage> {
    @Autowired
    RestaurantRepository restaurantRepository;

    @Override
    public Header<List<RestaurantImageResponse>> getPaginatedList(Pageable pageable) {
        Page<RestaurantImage> entities =  baseRepository.findAll(pageable);

        List<RestaurantImageResponse> restaurantImageResponsesList = entities.stream()
                .map(entity -> response(entity))
                .collect(Collectors.toList());

        Pagination pagination = Pagination.builder()
                .totalPages(entities.getTotalPages())
                .totalElements(entities.getTotalElements())
                .currentPage(entities.getNumber())
                .currentElements(entities.getNumberOfElements())
                .build();

        return Header.OK(restaurantImageResponsesList, pagination);
    }

    @Override
    protected RestaurantImageResponse response(RestaurantImage restaurantImage) {
        return new RestaurantImageResponse(restaurantImage);
    }

    protected List<RestaurantImageResponse> responseList(List<RestaurantImage> restaurantImageList){
        List<RestaurantImageResponse> responseList = new ArrayList<>();

        for(RestaurantImage restaurantImage : restaurantImageList){
            responseList.add(response(restaurantImage));
        }

        return responseList;
    }
    @Override
    public Header<RestaurantImageResponse> create(Header<RestaurantImageRequest> request) {
        RestaurantImageRequest imageRequest = request.getData();
        RestaurantImage restaurantImage = RestaurantImage.builder()
                .filename(imageRequest.getFilename())
                .path(imageRequest.getPath())
                .restaurant(imageRequest.getRestaurant())
                .build();

        baseRepository.save(restaurantImage);
        return Header.OK(response(restaurantImage));
    }

    @Override
    public Header<RestaurantImageResponse> read(Long id) {
        return Header.OK(response(baseRepository.findById(id).orElse(null)));
    }

    public Header<List<RestaurantImageResponse>> readByRestaurantId(Long restaurantId){
        Restaurant restaurant = restaurantRepository.findById(restaurantId).get();
        List<RestaurantImage> imageList = ((RestaurantImageRepository)baseRepository).findByRestaurant(restaurant).orElse(null);

        return Header.OK(responseList(imageList));
    }

    @Override
    public Header<RestaurantImageResponse> update(Long id, Header<RestaurantImageRequest> request) {
        RestaurantImageRequest restaurantImageRequest = request.getData();

        RestaurantImage restaurantImage = baseRepository.findById(id).orElse(null);

        restaurantImage.update(restaurantImageRequest);

        return Header.OK(response(restaurantImage));
    }

    @Override
    public Header delete(Long id) {
        return baseRepository.findById(id).map(
                restaurantImage -> {
                    baseRepository.delete(restaurantImage);
                    return Header.OK(response(restaurantImage));
                }
        ).orElseThrow(() -> new RuntimeException("Image delete fail"));
    }
}
