package com.itschool.tableq.controller.api;

import com.itschool.tableq.controller.CrudController;
import com.itschool.tableq.domain.MenuItem;
import com.itschool.tableq.network.Header;
import com.itschool.tableq.network.request.MenuItemRequest;
import com.itschool.tableq.network.response.MenuItemResponse;
import com.itschool.tableq.service.MenuItemService;
import groovy.util.logging.Slf4j;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@Tag(name = "메뉴", description = "메뉴 관련 API") // 문서에서 쉽게 찾도록 한글로 했음
@RestController
@RequestMapping("/api/menu-item")
public class MenuItemApiController extends CrudController<MenuItemRequest, MenuItemResponse, MenuItem> {

    @Operation(summary = "레스토랑별 메뉴 조회", description = "Restaurant ID로 엔티티 목록을 조회")
    @GetMapping("/restaurant/{id}")
    public Header<List<MenuItemResponse>> readByRestaurantId(@PathVariable(name = "id") Long id){
        log.info("{}","{}","read: ",id);
        return ((MenuItemService)baseService).readByRestaurantId(id);
    }
}
