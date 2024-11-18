$(document).ready(function() {
    if (window.location.pathname
    === '/restaurant/' + document.getElementById("restaurant-id").value) {
        requestRestaurantApi();
        requestReviewApi();
        requestMenuApi();
        requestOpeningHourApi();
        requestBreakHourApi();
        requestKeywordApi();
        requestAmenityApi();

        // 수정 버튼 클릭 시
        document.getElementById("modify-button").onclick = function() {
            const id = document.getElementById("restaurant-id").value;
            location.href = '/restaurant/modify/' + id;
        };

        // 리뷰탭 속 별점 주기
        $('.star_rating > .star').click(function() {
          $(this).parent().children('span').removeClass('on');
          $(this).addClass('on').prevAll('span').addClass('on');
        });
    }

    if (window.location.pathname
    === '/restaurant/modify/' + document.getElementById("restaurant-id").value) {
        requestRestaurantModifyApi();
        requestReviewApi();
        requestMenuModifyApi();
        requestOpeningHourModifyApi();
        requestBreakHourModifyApi();
        requestKeywordModifyApi();
        requestAmenityModifyApi();

        // 페이지를 이전 페이지로 이동
        document.getElementById('cancel').addEventListener('click', function() {
            window.history.back();
        });

        // 새로운 메뉴 추가
        document.getElementById('addMenuButton').addEventListener('click', function() {
            const menuItemHTML = `
                <div class="menu-item mb-4" style="display: flex; align-items: center;">
                    <div class="item-info">
                        <div>
                            <h4 style="display: flex; align-items: center;">
                                <input value="" placeholder="메뉴명">&nbsp;
                                <span class="badge" style="background-color: rgba(237, 125, 49, 1); font-size: 13px; display: flex; align-items: center;">추천
                                    <input type="checkbox" style="margin-left: 6px;">
                                </span>
                            </h4>
                            <h5 class="price" style="margin-bottom: 0px;"><input value="" placeholder="가격"></h5>
                        </div>
                    </div>
                    <img class="photo menu-img-modify" src="" alt="메뉴" onerror="this.src='https://placehold.jp/150x150.png'" onclick="triggerFileInput(this)"/>
                    <input type="file" style="display: none;" accept="image" onchange="updateImage(event, this)" />
                    <i class="bi bi-x-square px-4" style="font-size: 25px; cursor: pointer;" onclick="deleteMenuItem(this)"></i>
                </div>
            `;

            document.getElementById('addMenu').insertAdjacentHTML('beforebegin', menuItemHTML);
        });

        // keyword 취소 버튼 클릭 시 초기 상태로 복원
        document.getElementById('keyword-cancel').addEventListener('click', function() {
            document.querySelectorAll('#keyword input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = checkbox.getAttribute('data-initial-checked') === 'true';
            });
        });

        // amenity 취소 버튼 클릭 시 초기 상태로 복원
        document.getElementById('amenity-cancel').addEventListener('click', function() {
            document.querySelectorAll('#amenity input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = checkbox.getAttribute('data-initial-checked') === 'true';
            });
        });
    }

    // 리뷰 탭으로 이동
    document.getElementById("goToReview").addEventListener("click", function(event) {
        const reviewTab = new bootstrap.Tab(document.getElementById("review-tab"));
        reviewTab.show();
    });
});

// 주소 복사 기능
function copyText() {
    // 복사할 텍스트 가져오기
    const text = document.getElementById("text-copy").textContent;

    // 클립보드에 복사
    navigator.clipboard.writeText(text)
        .then(() => {
            alert("주소가 복사되었습니다.");
        })
        .catch((err) => {
            console.error("복사 실패:", err);
        });
}

// 메뉴 삭제
function deleteMenuItem(iconElement) {
    const menuItem = iconElement.closest('.menu-item');
    if (menuItem) {
        menuItem.remove();
    }
}

// 메뉴 이미지 파일 불러오기
function triggerFileInput(imgElement) {
    const fileInput = imgElement.nextElementSibling; // 해당 이미지 다음 형제 요소인 input을 선택
    fileInput.click(); // 클릭 이벤트 트리거
}

function updateImage(event, fileInputElement) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const imgElement = fileInputElement.previousElementSibling; // 해당 input의 이전 형제 요소인 img를 선택
        imgElement.src = e.target.result; // 새로운 이미지로 src 변경
    };

    if (file) {
        reader.readAsDataURL(file); // 파일 읽기
    }
}

// 상세 수정 페이지의 메인 이미지 파일 불러오기
function updateActiveCarouselImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const activeImage = document.querySelector('#carouselExampleControls .carousel-item.active img');

        if (activeImage) {
            activeImage.src = e.target.result; // 이미지 src를 업데이트합니다.
        }
    };

    if (file) {
        reader.readAsDataURL(file); // 파일을 Data URL로 읽어 이미지 업데이트
    }

    // 같은 파일 선택 시에도 업데이트를 트리거하기 위해 input value를 초기화합니다.
    event.target.value = '';
}

// 상세 페이지 restaurant API
function requestRestaurantApi() {

    const id = document.getElementById("restaurant-id").value;

    $.ajax({
        url: `/api/restaurant/${id}`,
        type: 'GET', // 필요한 HTTP 메서드로 변경
        contentType: 'application/json', // JSON 형식으로 데이터 전송
        success: function(response) {
            // 요청 성공 시 동작
            const rName = $('body > div > div.container.mt-5 > div > div > article:nth-child(1) > header > h1');
            const rAddress = $('#home > p:nth-child(4)');
            const rIntroduction = $('#introduction');
            const rContactNumber = $('#home > table > tbody > tr:nth-child(4) > td:nth-child(2)');

            rName[0].textContent = response.data.name;
            rAddress[0].textContent = response.data.address;
            rIntroduction[0].textContent = response.data.introduction;
            rContactNumber[0].textContent = response.data.contactNumber;

            if (response.data.available == false) {
                $('#available').css("display" ,"none");
                $("body > div > div.container.mt-5 > div > div > article:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2)")
                .text("현장대기 가능");
            } else {
                $("body > div > div.container.mt-5 > div > div > article:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2)")
                .text("원격줄서기, 현장대기 모두 가능");
            }

            // nav 속 마이페이지 클릭 시
            document.getElementById("nav-mypage").onclick = function() {
                location.href = '/owner/mypage/' + response.data.businessInformation.owner.id;
            }

            console.log('가게 set 완료');

        },
        error: function(xhr, status, error) {
            // 요청 실패 시 동작
            console.error('가게 set 실패:', error);
            alert('가게 set 중 오류가 발생했습니다.');
        }
    });
}

// 상세 수정 페이지 restaurant API
function requestRestaurantModifyApi() {

    const id = document.getElementById("restaurant-id").value;

    $.ajax({
        url: `/api/restaurant/${id}`,
        type: 'GET', // 필요한 HTTP 메서드로 변경
        contentType: 'application/json', // JSON 형식으로 데이터 전송
        success: function(response) {
            // 요청 성공 시 동작
            const rName = $('body > div > div.container.mt-5 > div > div > article:nth-child(1) > header > h1 > input');
            const rAddress = $('#home > div:nth-child(4) > input');
            const rIntroduction = $('#introduction');
            const rContactNumber = $('#times-modal > div > div > div.modal-body > div.card.mb-3 > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > input');

            rName.val(response.data.name);
            rAddress.val(response.data.address);
            rIntroduction.val(response.data.introduction);
            rContactNumber.val(response.data.contactNumber);

            if (response.data.available == false) {
                $('#available').css("display" ,"none");
                $("body > div > div.container.mt-5 > div > div > article:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2)")
                .text("현장대기 가능");
            } else {
                $("body > div > div.container.mt-5 > div > div > article:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2)")
                .text("원격줄서기, 현장대기 모두 가능");
            }

            // nav 속 마이페이지 클릭 시
            document.getElementById("nav-mypage").onclick = function() {
                location.href = '/owner/mypage/' + response.data.businessInformation.owner.id;
            }

            console.log('가게 수정 set 완료');

        },
        error: function(xhr, status, error) {
            // 요청 실패 시 동작
            console.error('가게 수정 set 실패:', error);
            alert('가게 수정 set 중 오류가 발생했습니다.');
        }
    });
}

// restaurantImage API
function requestRestaurantImageApi() {

    const id = document.getElementById("restaurant-id").value;

    $.ajax({
        url: `/api/restaurant-image/${id}`,
        type: 'GET', // 필요한 HTTP 메서드로 변경
        contentType: 'application/json', // JSON 형식으로 데이터 전송
        success: function(response) {
            // 요청 성공 시 동작
            const rImage = $('#carouselExampleControls > div > div.carousel-item.active > img');

            rImage.attr('src', response.data.path);

            console.log('가게 이미지 set 완료');

        },
        error: function(xhr, status, error) {
        // 요청 실패 시 동작
        console.error('가게 이미지 set 실패:', error);
        alert('가게 이미지 set 중 오류가 발생했습니다.');
        }
    });
}

// review API
function requestReviewApi() {

    const id = document.getElementById("restaurant-id").value;

    $.ajax({
        url: `/api/review/restaurant/${id}`,
        type: 'GET', // 필요한 HTTP 메서드로 변경
        contentType: 'application/json', // JSON 형식으로 데이터 전송
        data: {
               "page" : 0,
               "size" : 10
              },
        success: function(response) {
            // 요청 성공 시 동작
            const reviews = response.data; // 리뷰 데이터 배열

            $('#reviews-number')[0].textContent = '리뷰 ' + reviews.length + '건';
            $('#goToReview')[0].textContent = reviews.length + '개의 리뷰';

            // 별점 평균 계산 및 출력
            const totalStars = reviews.reduce((sum, review) => sum + review.starRating, 0);
            const averageStars = (reviews.length > 0) ? (totalStars / reviews.length).toFixed(1) : 0;
            $('#average-1').html('&nbsp;' + averageStars +'&nbsp;/&nbsp;');
            $('#average-2').html('&nbsp;' + averageStars);

            // 별점별 리뷰 카운트 및 출력
            const fiveStarCount = reviews.filter(review => review.starRating === 5).length;
            const fourStarCount = reviews.filter(review => review.starRating === 4).length;
            const threeStarCount = reviews.filter(review => review.starRating === 3).length;
            const twoStarCount = reviews.filter(review => review.starRating === 2).length;
            const oneStarCount = reviews.filter(review => review.starRating === 1).length;

            $('#5-point').html(fiveStarCount + '개');
            $('#4-point').html(fourStarCount + '개');
            $('#3-point').html(threeStarCount + '개');
            $('#2-point').html(twoStarCount + '개');
            $('#1-point').html(oneStarCount + '개');

            // 별점별 bar 길이 설정
            fiveBar = (fiveStarCount / reviews.length) * 100;
            fourBar = (fourStarCount / reviews.length) * 100;
            threeBar = (threeStarCount / reviews.length) * 100;
            twoBar = (twoStarCount / reviews.length) * 100;
            oneBar = (oneStarCount / reviews.length) * 100;

            $('#5-bar').css('width', fiveBar + '%');
            $('#4-bar').css('width', fourBar + '%');
            $('#3-bar').css('width', threeBar + '%');
            $('#2-bar').css('width', twoBar + '%');
            $('#1-bar').css('width', oneBar + '%');

            // 각 리뷰를 form 아래에 반복해서 추가
            reviews.forEach((review) => {

                // TIMESTAMP를 Date 객체로 변환 후 년, 월, 일 포맷으로 변환
                const createdAt = new Date(review.createdAt);
                const formattedDate =
                `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}-${String(createdAt.getDate()).padStart(2, '0')}`;

                // 별점별 별 아이콘을 추가할 문자열
                let starIcons = '';
                if (review.starRating === 5) {
                    starIcons = '<i class="bi bi-star-fill" style="color: #FAC608 !important;"></i>'
                              + '<i class="bi bi-star-fill" style="color: #FAC608 !important;"></i>'
                              + '<i class="bi bi-star-fill" style="color: #FAC608 !important;"></i>'
                              + '<i class="bi bi-star-fill" style="color: #FAC608 !important;"></i>'
                              + '<i class="bi bi-star-fill" style="color: #FAC608 !important;"></i>';
                } else if (review.starRating === 4) {
                    starIcons = '<i class="bi bi-star-fill" style="color: #FAC608 !important;"></i>'
                              + '<i class="bi bi-star-fill" style="color: #FAC608 !important;"></i>'
                              + '<i class="bi bi-star-fill" style="color: #FAC608 !important;"></i>'
                              + '<i class="bi bi-star-fill" style="color: #FAC608 !important;"></i>'
                              + '<i class="bi bi-star-fill" style="color: #e0e0e0 !important;"></i>';

                } else if (review.starRating === 3) {
                    starIcons = '<i class="bi bi-star-fill" style="color: #FAC608 !important;"></i>'
                              + '<i class="bi bi-star-fill" style="color: #FAC608 !important;"></i>'
                              + '<i class="bi bi-star-fill" style="color: #FAC608 !important;"></i>'
                              + '<i class="bi bi-star-fill" style="color: #e0e0e0 !important;"></i>'
                              + '<i class="bi bi-star-fill" style="color: #e0e0e0 !important;"></i>';

                } else if (review.starRating === 2) {
                    starIcons = '<i class="bi bi-star-fill" style="color: #FAC608 !important;"></i>'
                              + '<i class="bi bi-star-fill" style="color: #FAC608 !important;"></i>'
                              + '<i class="bi bi-star-fill" style="color: #e0e0e0 !important;"></i>'
                              + '<i class="bi bi-star-fill" style="color: #e0e0e0 !important;"></i>'
                              + '<i class="bi bi-star-fill" style="color: #e0e0e0 !important;"></i>';

                } else if (review.starRating === 1) {
                    starIcons = '<i class="bi bi-star-fill" style="color: #FAC608 !important;"></i>'
                              + '<i class="bi bi-star-fill" style="color: #e0e0e0 !important;"></i>'
                              + '<i class="bi bi-star-fill" style="color: #e0e0e0 !important;"></i>'
                              + '<i class="bi bi-star-fill" style="color: #e0e0e0 !important;"></i>'
                              + '<i class="bi bi-star-fill" style="color: #e0e0e0 !important;"></i>';
                }

                const reviewHtml = `
                    <hr style="margin: 1.5rem 0;">
                    <div class="d-flex">
                        <div class="ms-3">
                            <div>${starIcons}</div>
                            <div class="fw-bold mt-2 mb-3">${review.user.name}<small>&nbsp;(${formattedDate})</small></div>
                            <p style="margin: 0;">${review.content}</p>
                        </div>
                    </div>
                `;

                // review-form 요소(외부) 바로 뒤에 추가
                $('#review-form').after(reviewHtml);
            });

            console.log('리뷰 set 완료');
        },
        error: function(xhr, status, error) {
        // 요청 실패 시 동작
        console.error('리뷰 set 실패:', error);
        alert('리뷰 set 중 오류가 발생했습니다.');
        }
    });
}

// 점주 상세 페이지 menu API
function requestMenuApi() {

    const id = document.getElementById("restaurant-id").value;

    $.ajax({
        url: `/api/menu-item/restaurant/${id}`,
        type: 'GET', // 필요한 HTTP 메서드로 변경
        contentType: 'application/json', // JSON 형식으로 데이터 전송
        success: function(response) {
            // 요청 성공 시 동작
            const menus = (response.data).sort((a, b) => a.id - b.id); // 메뉴 데이터 배열(오름차순)

            menus.forEach((menu) => {

                let menuHtml =
                    `
                    <div class="menu-item mb-4" style="display: flex; align-items: center;">
                        <div class="item-info">
                            <div style="display: flex; align-items: center; margin-bottom: 12px;">
                               <h4 class="m-0">${menu.name}</h4>
                    `;

                if (menu.recommendation) {
                    menuHtml +=
                        `
                                    <span class="badge ms-2" style="background-color: rgba(237, 125, 49, 1); font-size: 13px;">추천</span>
                        `;
                }

                menuHtml +=
                    `
                            </div>
                            <h5 class="price" style="margin-bottom: 0px;">${menu.price}원</h5>
                        </div>
                        <img class="photo menu-img" src="
                    `;

                if (menu.imageUrl !== null) {
                    menuHtml += `${menu.imageUrl}`;
                }

                menuHtml +=
                    `" alt="메뉴" onerror="this.src='https://placehold.jp/150x150.png'"
                    />
                    </div>
                    `;

                // menu-list 요소(내부) 끝에 추가
                $('#menu-list').append(menuHtml);
            });

            console.log('메뉴 set 완료');
        },
        error: function(xhr, status, error) {
        // 요청 실패 시 동작
        console.error('메뉴 set 실패:', error);
        alert('메뉴 set 중 오류가 발생했습니다.');
        }
    });
}

// 상세 수정 페이지 menu API
function requestMenuModifyApi() {

    const id = document.getElementById("restaurant-id").value;

    $.ajax({
        url: `/api/menu-item/restaurant/${id}`,
        type: 'GET', // 필요한 HTTP 메서드로 변경
        contentType: 'application/json', // JSON 형식으로 데이터 전송
        success: function(response) {
            // 요청 성공 시 동작
            const menus = (response.data).sort((a, b) => a.id - b.id); // 메뉴 데이터 배열(오름차순)

            menus.forEach((menu) => {

                if (menu.recommendation !== true) {

                    const menuModifyHtml = `
                        <div class="menu-item mb-4" style="display: flex; align-items: center;">
                            <div class="item-info">
                                <h4 style="display: flex; align-items: center;">
                                    <input value="${menu.name}" placeholder="메뉴명">&nbsp;
                                    <span class="badge" style="background-color: rgba(237, 125, 49, 1); font-size: 13px; display: flex; align-items: center;">추천
                                        <input type="checkbox" style="margin-left: 6px;">
                                    </span>
                                </h4>
                                <h5 class="price" style="margin-bottom: 0px;"><input value="${menu.price}원" placeholder="가격"></h5>
                            <!--<p class="item-text">
                                새우가 포함된 텐동
                                </p>-->
                            </div>
                            <img class="photo menu-img-modify" src="${menu.imageUrl}" alt="메뉴" onerror="this.src='https://placehold.jp/150x150.png'" onclick="triggerFileInput(this)"/>
                            <input type="file" style="display: none;" accept="image/*" onchange="updateImage(event, this)" />
                            <i class="bi bi-x-square px-4" style="font-size: 25px; cursor: pointer;" onclick="deleteMenuItem(this)"></i>
                        </div>
                    `;

                    // menu-list 요소(내부) 끝에 추가
                    $('#menu-list').append(menuModifyHtml);

                } else if (menu.recommendation === true) {

                    const menuModifyHtml = `
                        <div class="menu-item mb-4" style="display: flex; align-items: center;">
                            <div class="item-info">
                                <h4 style="display: flex; align-items: center;">
                                    <input value="${menu.name}" placeholder="메뉴명">&nbsp;
                                    <span class="badge" style="background-color: rgba(237, 125, 49, 1); font-size: 13px; display: flex; align-items: center;">추천
                                        <input type="checkbox" style="margin-left: 6px;" checked>
                                    </span>
                                </h4>
                                <h5 class="price" style="margin-bottom: 0px;"><input value="${menu.price}원" placeholder="가격"></h5>
                            <!--<p class="item-text">
                                새우가 포함된 텐동
                                </p>-->
                            </div>
                            <img class="photo menu-img-modify" src="${menu.imageUrl}" alt="메뉴" onerror="this.src='https://placehold.jp/150x150.png'" onclick="triggerFileInput(this)"/>
                            <input type="file" style="display: none;" accept="image/*" onchange="updateImage(event, this)" />
                            <i class="bi bi-x-square px-4" style="font-size: 25px; cursor: pointer;" onclick="deleteMenuItem(this)"></i>
                        </div>
                    `;

                    // menu-list 요소의 끝에 새로운 메뉴 항목을 추가
                    $('#menu-list').append(menuModifyHtml);
                }
            });

            console.log('메뉴 수정 set 완료');
        },
        error: function(xhr, status, error) {
        // 요청 실패 시 동작
        console.error('메뉴 수정 set 실패:', error);
        alert('메뉴 수정 set 중 오류가 발생했습니다.');
        }
    });
}

// 상세 페이지 opening-hour API
function requestOpeningHourApi() {

    const id = document.getElementById("restaurant-id").value;

    $.ajax({
        url: `/api/openinghour/restaurant/${id}`,
        type: 'GET', // 필요한 HTTP 메서드로 변경
        contentType: 'application/json', // JSON 형식으로 데이터 전송
        data: {
               "page" : 0,
               "size" : 10
              },
        success: function(response) {
            // 요청 성공 시 동작
            const opens = response.data; // 운영시간 데이터 배열

            const today = new Date();
            const currentTime
                = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0');
            let formattedOpenTime;
            let formattedCloseTime;

            opens.forEach((open) => {
                switch (open.dayOfWeek) {
                    case 'monday' :
                        formattedOpenTime = open.openAt.substring(0, 5);
                        formattedCloseTime = open.closeAt.substring(0, 5);

                        $('#monday-open')[0].textContent = formattedOpenTime + ' ~ ' + formattedCloseTime;

                        if(today.getDay() === 1) {
                            if (currentTime >= formattedOpenTime && currentTime < formattedCloseTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>영업중</strong> : 오늘 ' +  formattedOpenTime + ' ~ ' + formattedCloseTime);
                            }
                            $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                            $('#today-open-3').html('오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                            $('#today-week')[0].textContent = '오늘 (월요일)';
                            $('#today-open-4')[0].textContent = formattedOpenTime + ' ~ ' + formattedCloseTime;
                        }
                        break;
                    case 'tuesday' :
                        formattedOpenTime = open.openAt.substring(0, 5);
                        formattedCloseTime = open.closeAt.substring(0, 5);

                        $('#tuesday-open')[0].textContent = formattedOpenTime + ' ~ ' + formattedCloseTime;

                        if(today.getDay() === 2) {
                            if (currentTime >= formattedOpenTime && currentTime < formattedCloseTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>영업중</strong> : 오늘 ' +  formattedOpenTime + ' ~ ' + formattedCloseTime);
                            }
                            $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                            $('#today-open-3').html('오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                            $('#today-week')[0].textContent = '오늘 (화요일)';
                            $('#today-open-4')[0].textContent = formattedOpenTime + ' ~ ' + formattedCloseTime;
                        }
                        break;
                    case 'wednesday' :
                        formattedOpenTime = open.openAt.substring(0, 5);
                        formattedCloseTime = open.closeAt.substring(0, 5);

                        $('#wednesday-open')[0].textContent = formattedOpenTime + ' ~ ' + formattedCloseTime;

                        if(today.getDay() === 3) {
                            if (currentTime >= formattedOpenTime && currentTime < formattedCloseTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>영업중</strong> : 오늘 ' +  formattedOpenTime + ' ~ ' + formattedCloseTime);
                            }
                            $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                            $('#today-open-3').html('오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                            $('#today-week')[0].textContent = '오늘 (수요일)';
                            $('#today-open-4')[0].textContent = formattedOpenTime + ' ~ ' + formattedCloseTime;
                        }
                        break;
                    case 'thursday' :
                        formattedOpenTime = open.openAt.substring(0, 5);
                        formattedCloseTime = open.closeAt.substring(0, 5);

                        $('#thursday-open')[0].textContent = formattedOpenTime + ' ~ ' + formattedCloseTime;

                        if(today.getDay() === 4) {
                            if (currentTime >= formattedOpenTime && currentTime < formattedCloseTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>영업중</strong> : 오늘 ' +  formattedOpenTime + ' ~ ' + formattedCloseTime);
                            }
                            $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                            $('#today-open-3').html('오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                            $('#today-week')[0].textContent = '오늘 (목요일)';
                            $('#today-open-4')[0].textContent = formattedOpenTime + ' ~ ' + formattedCloseTime;
                        }
                        break;
                    case 'friday' :
                        formattedOpenTime = open.openAt.substring(0, 5);
                        formattedCloseTime = open.closeAt.substring(0, 5);

                        $('#friday-open')[0].textContent = formattedOpenTime + ' ~ ' + formattedCloseTime;

                        if(today.getDay() === 5) {
                            if (currentTime >= formattedOpenTime && currentTime < formattedCloseTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>영업중</strong> : 오늘 ' +  formattedOpenTime + ' ~ ' + formattedCloseTime);
                            }
                            $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                            $('#today-open-3').html('오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                            $('#today-week')[0].textContent = '오늘 (금요일)';
                            $('#today-open-4')[0].textContent = formattedOpenTime + ' ~ ' + formattedCloseTime;
                        }
                        break;
                    case 'saturday' :
                        formattedOpenTime = open.openAt.substring(0, 5);
                        formattedCloseTime = open.closeAt.substring(0, 5);

                        $('#saturday-open')[0].textContent = formattedOpenTime + ' ~ ' + formattedCloseTime;

                        if(today.getDay() === 6) {
                            if (currentTime >= formattedOpenTime && currentTime < formattedCloseTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>영업중</strong> : 오늘 ' +  formattedOpenTime + ' ~ ' + formattedCloseTime);
                            }
                            $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                            $('#today-open-3').html('오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                            $('#today-week')[0].textContent = '오늘 (토요일)';
                            $('#today-open-4')[0].textContent = formattedOpenTime + ' ~ ' + formattedCloseTime;
                        }
                        break;
                    case 'sunday' :
                        formattedOpenTime = open.openAt.substring(0, 5);
                        formattedCloseTime = open.closeAt.substring(0, 5);

                        $('#sunday-open')[0].textContent = formattedOpenTime + ' ~ ' + formattedCloseTime;

                        if(today.getDay() === 0) {
                            if (currentTime >= formattedOpenTime && currentTime < formattedCloseTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>영업중</strong> : 오늘 ' +  formattedOpenTime + ' ~ ' + formattedCloseTime);
                            }
                            $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                            $('#today-open-3').html('오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                            $('#today-week')[0].textContent = '오늘 (일요일)';
                            $('#today-open-4')[0].textContent = formattedOpenTime + ' ~ ' + formattedCloseTime;
                        }
                        break;
                }
            });

            console.log('운영시간 set 완료');
        },
         error: function(xhr, status, error) {
         // 요청 실패 시 동작
         console.error('운영시간 set 실패:', error);
         alert('운영시간 set 중 오류가 발생했습니다.');
         }
    });
}

// 상세 수정 페이지 opening-hour API
function requestOpeningHourModifyApi() {

    const id = document.getElementById("restaurant-id").value;

    $.ajax({
        url: `/api/openinghour/restaurant/${id}`,
        type: 'GET', // 필요한 HTTP 메서드로 변경
        contentType: 'application/json', // JSON 형식으로 데이터 전송
        data: {
               "page" : 0,
               "size" : 10
              },
        success: function(response) {
            // 요청 성공 시 동작
            const opens = response.data; // 운영시간 데이터 배열

            const today = new Date();
            const currentTime
                = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0');
            let formattedOpenTime;
            let formattedCloseTime;

            opens.forEach((open) => {
                switch (open.dayOfWeek) {
                    case 'monday' :
                        $('#monday-open').val(open.openAt);
                        $('#monday-close').val(open.closeAt);

                        formattedOpenTime = open.openAt.substring(0, 5);
                        formattedCloseTime = open.closeAt.substring(0, 5);

                        if(today.getDay() === 1) {
                            if (currentTime >= formattedOpenTime && currentTime < formattedCloseTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>영업중</strong> : 오늘 ' +  formattedOpenTime + ' ~ ' + formattedCloseTime);
                            }
                            $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                        }
                        break;
                    case 'tuesday' :
                        $('#tuesday-open').val(open.openAt);
                        $('#tuesday-close').val(open.closeAt);

                        formattedOpenTime = open.openAt.substring(0, 5);
                        formattedCloseTime = open.closeAt.substring(0, 5);

                        if(today.getDay() === 2) {
                            if (currentTime >= formattedOpenTime && currentTime < formattedCloseTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>영업중</strong> : 오늘 ' +  formattedOpenTime + ' ~ ' + formattedCloseTime);
                            }
                            $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                        }
                        break;
                    case 'wednesday' :
                        $('#wednesday-open').val(open.openAt);
                        $('#wednesday-close').val(open.closeAt);

                        formattedOpenTime = open.openAt.substring(0, 5);
                        formattedCloseTime = open.closeAt.substring(0, 5);

                        if(today.getDay() === 3) {
                            if (currentTime >= formattedOpenTime && currentTime < formattedCloseTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>영업중</strong> : 오늘 ' +  formattedOpenTime + ' ~ ' + formattedCloseTime);
                            }
                            $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                        }
                        break;
                    case 'thursday' :
                        $('#thursday-open').val(open.openAt);
                        $('#thursday-close').val(open.closeAt);

                        formattedOpenTime = open.openAt.substring(0, 5);
                        formattedCloseTime = open.closeAt.substring(0, 5);

                        if(today.getDay() === 4) {
                            if (currentTime >= formattedOpenTime && currentTime < formattedCloseTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>영업중</strong> : 오늘 ' +  formattedOpenTime + ' ~ ' + formattedCloseTime);
                            }
                            $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                        }
                        break;
                    case 'friday' :
                        $('#friday-open').val(open.openAt);
                        $('#friday-close').val(open.closeAt);

                        formattedOpenTime = open.openAt.substring(0, 5);
                        formattedCloseTime = open.closeAt.substring(0, 5);

                        if(today.getDay() === 5) {
                            if (currentTime >= formattedOpenTime && currentTime < formattedCloseTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>영업중</strong> : 오늘 ' +  formattedOpenTime + ' ~ ' + formattedCloseTime);
                            }
                            $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                        }
                        break;
                    case 'saturday' :
                        $('#saturday-open').val(open.openAt);
                        $('#saturday-close').val(open.closeAt);

                        formattedOpenTime = open.openAt.substring(0, 5);
                        formattedCloseTime = open.closeAt.substring(0, 5);

                        if(today.getDay() === 6) {
                            if (currentTime >= formattedOpenTime && currentTime < formattedCloseTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>영업중</strong> : 오늘 ' +  formattedOpenTime + ' ~ ' + formattedCloseTime);
                            }
                            $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                        }
                        break;
                    case 'sunday' :
                        $('#sunday-open').val(open.openAt);
                        $('#sunday-close').val(open.closeAt);

                        formattedOpenTime = open.openAt.substring(0, 5);
                        formattedCloseTime = open.closeAt.substring(0, 5);

                        if(today.getDay() === 0) {
                            if (currentTime >= formattedOpenTime && currentTime < formattedCloseTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>영업중</strong> : 오늘 ' +  formattedOpenTime + ' ~ ' + formattedCloseTime);
                            }
                            $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;오늘 ' + formattedOpenTime + ' ~ ' + formattedCloseTime);
                        }
                        break;
                }
            });

            console.log('운영시간 수정 set 완료');
        },
         error: function(xhr, status, error) {
         // 요청 실패 시 동작
         console.error('운영시간 수정 set 실패:', error);
         alert('운영시간 수정 set 중 오류가 발생했습니다.');
         }
    });
}

// 상세 페이지 break-hour API
function requestBreakHourApi() {

    const id = document.getElementById("restaurant-id").value;

    $.ajax({
        url: `/api/breakhour/restaurant/${id}`,
        type: 'GET', // 필요한 HTTP 메서드로 변경
        contentType: 'application/json', // JSON 형식으로 데이터 전송
        data: {
               "page" : 0,
               "size" : 10
              },
        success: function(response) {
            // 요청 성공 시 동작
            const breaks = response.data; // 브레이크타임 데이터 배열

            const today = new Date();
            const currentTime
                = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0');
            let formattedStartTime;
            let formattedEndTime;

            breaks.forEach((breaking) => {
                switch (breaking.dayOfWeek) {
                    case 'monday' :
                        formattedStartTime = breaking.breakStart.substring(0, 5);
                        formattedEndTime = breaking.breakEnd.substring(0, 5);

                        $('#monday-break')[0].textContent = formattedStartTime + ' ~ ' + formattedEndTime;

                        if(today.getDay() === 1) {
                            if (currentTime >= formattedStartTime && currentTime < formattedEndTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>브레이크 타임</strong> : ' +  formattedStartTime + ' ~ ' + formattedEndTime);
                                $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;<strong>브레이크 타임</strong> ' + formattedStartTime + ' ~ ' + formattedEndTime);
                            }
                            $('#today-break')[0].textContent = formattedStartTime + ' ~ ' + formattedEndTime;
                        }
                        break;
                    case 'tuesday' :
                        formattedStartTime = breaking.breakStart.substring(0, 5);
                        formattedEndTime = breaking.breakEnd.substring(0, 5);

                        $('#monday-break')[0].textContent = formattedStartTime + ' ~ ' + formattedEndTime;

                        if(today.getDay() === 2) {
                            if (currentTime >= formattedStartTime && currentTime < formattedEndTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>브레이크 타임</strong> : ' +  formattedStartTime + ' ~ ' + formattedEndTime);
                                $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;<strong>브레이크 타임</strong> ' + formattedStartTime + ' ~ ' + formattedEndTime);
                            }
                            $('#today-break')[0].textContent = formattedStartTime + ' ~ ' + formattedEndTime;
                        }
                        break;
                    case 'wednesday' :
                        formattedStartTime = breaking.breakStart.substring(0, 5);
                        formattedEndTime = breaking.breakEnd.substring(0, 5);

                        $('#monday-break')[0].textContent = formattedStartTime + ' ~ ' + formattedEndTime;

                        if(today.getDay() === 3) {
                            if (currentTime >= formattedStartTime && currentTime < formattedEndTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>브레이크 타임</strong> : ' +  formattedStartTime + ' ~ ' + formattedEndTime);
                                $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;<strong>브레이크 타임</strong> ' + formattedStartTime + ' ~ ' + formattedEndTime);
                            }
                            $('#today-break')[0].textContent = formattedStartTime + ' ~ ' + formattedEndTime;
                        }
                        break;
                    case 'thursday' :
                        formattedStartTime = breaking.breakStart.substring(0, 5);
                        formattedEndTime = breaking.breakEnd.substring(0, 5);

                        $('#monday-break')[0].textContent = formattedStartTime + ' ~ ' + formattedEndTime;

                        if(today.getDay() === 4) {
                            if (currentTime >= formattedStartTime && currentTime < formattedEndTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>브레이크 타임</strong> : ' +  formattedStartTime + ' ~ ' + formattedEndTime);
                                $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;<strong>브레이크 타임</strong> ' + formattedStartTime + ' ~ ' + formattedEndTime);
                            }
                            $('#today-break')[0].textContent = formattedStartTime + ' ~ ' + formattedEndTime;
                        }
                        break;
                    case 'friday' :
                        formattedStartTime = breaking.breakStart.substring(0, 5);
                        formattedEndTime = breaking.breakEnd.substring(0, 5);

                        $('#monday-break')[0].textContent = formattedStartTime + ' ~ ' + formattedEndTime;

                        if(today.getDay() === 5) {
                            if (currentTime >= formattedStartTime && currentTime < formattedEndTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>브레이크 타임</strong> : ' +  formattedStartTime + ' ~ ' + formattedEndTime);
                                $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;<strong>브레이크 타임</strong> ' + formattedStartTime + ' ~ ' + formattedEndTime);
                            }
                            $('#today-break')[0].textContent = formattedStartTime + ' ~ ' + formattedEndTime;
                        }
                        break;
                    case 'saturday' :
                        formattedStartTime = breaking.breakStart.substring(0, 5);
                        formattedEndTime = breaking.breakEnd.substring(0, 5);

                        $('#monday-break')[0].textContent = formattedStartTime + ' ~ ' + formattedEndTime;

                        if(today.getDay() === 6) {
                            if (currentTime >= formattedStartTime && currentTime < formattedEndTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>브레이크 타임</strong> : ' +  formattedStartTime + ' ~ ' + formattedEndTime);
                                $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;<strong>브레이크 타임</strong> ' + formattedStartTime + ' ~ ' + formattedEndTime);
                            }
                            $('#today-break')[0].textContent = formattedStartTime + ' ~ ' + formattedEndTime;
                        }
                        break;
                    case 'sunday' :
                        formattedStartTime = breaking.breakStart.substring(0, 5);
                        formattedEndTime = breaking.breakEnd.substring(0, 5);

                        $('#monday-break')[0].textContent = formattedStartTime + ' ~ ' + formattedEndTime;

                        if(today.getDay() === 0) {
                            if (currentTime >= formattedStartTime && currentTime < formattedEndTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>브레이크 타임</strong> : ' +  formattedStartTime + ' ~ ' + formattedEndTime);
                                $('#today-open-2').html('<i class="fas fa-clock"></i> 원격줄서기 시간 :&nbsp;&nbsp;<strong>브레이크 타임</strong> ' + formattedStartTime + ' ~ ' + formattedEndTime);
                            }
                            $('#today-break')[0].textContent = formattedStartTime + ' ~ ' + formattedEndTime;
                        }
                        break;
                }
            });

            console.log('브레이크 타임 set 완료');
        },
        error: function(xhr, status, error) {
        // 요청 실패 시 동작
        console.error('브레이크 타임 set 실패:', error);
        alert('브레이크 타임 set 중 오류가 발생했습니다.');
        }
    });
}

// 상세 수정 페이지 break-hour API
function requestBreakHourModifyApi() {

    const id = document.getElementById("restaurant-id").value;

    $.ajax({
        url: `/api/breakhour/restaurant/${id}`,
        type: 'GET', // 필요한 HTTP 메서드로 변경
        contentType: 'application/json', // JSON 형식으로 데이터 전송
        data: {
               "page" : 0,
               "size" : 10
              },
        success: function(response) {
            // 요청 성공 시 동작
            const breaks = response.data; // 브레이크타임 데이터 배열

            const today = new Date();
            const currentTime
                = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0');
            let formattedStartTime;
            let formattedEndTime;

            breaks.forEach((breaking) => {
                switch (breaking.dayOfWeek) {
                    case 'monday' :
                        $('#monday-break-start').val(breaking.breakStart);
                        $('#monday-break-end').val(breaking.breakEnd);

                        formattedStartTime = breaking.breakStart.substring(0, 5);
                        formattedEndTime = breaking.breakEnd.substring(0, 5);

                        if(today.getDay() === 1) {
                            if (currentTime >= formattedStartTime && currentTime < formattedEndTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>브레이크 타임</strong> : ' +  formattedStartTime + ' ~ ' + formattedEndTime);
                            }
                        }
                        break;
                    case 'tuesday' :
                        formattedStartTime = breaking.breakStart.substring(0, 5);
                        formattedEndTime = breaking.breakEnd.substring(0, 5);

                        $('#monday-break')[0].textContent = formattedStartTime + ' ~ ' + formattedEndTime;

                        if(today.getDay() === 2) {
                            if (currentTime >= formattedStartTime && currentTime < formattedEndTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>브레이크 타임</strong> : ' +  formattedStartTime + ' ~ ' + formattedEndTime);
                            }
                        }
                        break;
                    case 'wednesday' :
                        formattedStartTime = breaking.breakStart.substring(0, 5);
                        formattedEndTime = breaking.breakEnd.substring(0, 5);

                        $('#monday-break')[0].textContent = formattedStartTime + ' ~ ' + formattedEndTime;

                        if(today.getDay() === 3) {
                            if (currentTime >= formattedStartTime && currentTime < formattedEndTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>브레이크 타임</strong> : ' +  formattedStartTime + ' ~ ' + formattedEndTime);
                            }
                        }
                        break;
                    case 'thursday' :
                        formattedStartTime = breaking.breakStart.substring(0, 5);
                        formattedEndTime = breaking.breakEnd.substring(0, 5);

                        $('#monday-break')[0].textContent = formattedStartTime + ' ~ ' + formattedEndTime;

                        if(today.getDay() === 4) {
                            if (currentTime >= formattedStartTime && currentTime < formattedEndTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>브레이크 타임</strong> : ' +  formattedStartTime + ' ~ ' + formattedEndTime);
                            }
                        }
                        break;
                    case 'friday' :
                        formattedStartTime = breaking.breakStart.substring(0, 5);
                        formattedEndTime = breaking.breakEnd.substring(0, 5);

                        $('#monday-break')[0].textContent = formattedStartTime + ' ~ ' + formattedEndTime;

                        if(today.getDay() === 5) {
                            if (currentTime >= formattedStartTime && currentTime < formattedEndTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>브레이크 타임</strong> : ' +  formattedStartTime + ' ~ ' + formattedEndTime);
                            }
                        }
                        break;
                    case 'saturday' :
                        formattedStartTime = breaking.breakStart.substring(0, 5);
                        formattedEndTime = breaking.breakEnd.substring(0, 5);

                        $('#monday-break')[0].textContent = formattedStartTime + ' ~ ' + formattedEndTime;

                        if(today.getDay() === 6) {
                            if (currentTime >= formattedStartTime && currentTime < formattedEndTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>브레이크 타임</strong> : ' +  formattedStartTime + ' ~ ' + formattedEndTime);
                            }
                        }
                        break;
                    case 'sunday' :
                        formattedStartTime = breaking.breakStart.substring(0, 5);
                        formattedEndTime = breaking.breakEnd.substring(0, 5);

                        $('#monday-break')[0].textContent = formattedStartTime + ' ~ ' + formattedEndTime;

                        if(today.getDay() === 0) {
                            if (currentTime >= formattedStartTime && currentTime < formattedEndTime) {
                                $('#today-open-1').html('<i class="fas fa-clock"></i> <strong>브레이크 타임</strong> : ' +  formattedStartTime + ' ~ ' + formattedEndTime);
                            }
                        }
                        break;
                }
            });

            console.log('브레이크 타임 수정 set 완료');
        },
        error: function(xhr, status, error) {
        // 요청 실패 시 동작
        console.error('브레이크 타임 수정 set 실패:', error);
        alert('브레이크 타임 수정 set 중 오류가 발생했습니다.');
        }
    });
}

// 상세 페이지 keyword API
function requestKeywordApi() {

    const id = document.getElementById("restaurant-id").value;

    $.ajax({
        url: `/api/restaurantkeyword/restaurant/${id}`,
        type: 'GET', // 필요한 HTTP 메서드로 변경
        contentType: 'application/json', // JSON 형식으로 데이터 전송
        success: function(response) {
            // 요청 성공 시 동작
            const restaurantKeyword = response.data; // 키워드 데이터 배열

            restaurantKeyword.forEach((keywords) => {
                let keywordHtml =
                    `
                    <a class="pick-outline mb-2">${keywords.keyword.name}</a>
                    `;
                // keyword 요소(내부) 끝에 추가
                $('#keyword').append(keywordHtml);
            });

            console.log('키워드 set 완료');
        },
        error: function(xhr, status, error) {
        // 요청 실패 시 동작
        console.error('키워드 set 실패:', error);
        alert('키워드 set 중 오류가 발생했습니다.');
        }
    });
}

// 상세 수정 페이지 keyword API
function requestKeywordModifyApi() {

    const id = document.getElementById("restaurant-id").value;

    $.ajax({
        url: `/api/restaurantkeyword/restaurant/${id}`,
        type: 'GET', // 필요한 HTTP 메서드로 변경
        contentType: 'application/json', // JSON 형식으로 데이터 전송
        success: function(response) {
            // 요청 성공 시 동작
            const restaurantKeyword = response.data; // 키워드 데이터 배열
            const labels = document.querySelectorAll("#keyword .form-check-label");

            restaurantKeyword.forEach((keywords) => {
                labels.forEach((label) => {
                    if (label.textContent.trim() === keywords.keyword.name) {
                        label.previousElementSibling.checked = true; // 해당 라벨의 체크박스를 체크

                        // 초기 상태 저장
                        label.previousElementSibling.setAttribute('data-initial-checked', 'true');
                    }
                });
            });

            console.log('키워드 수정 set 완료');
        },
        error: function(xhr, status, error) {
        // 요청 실패 시 동작
        console.error('키워드 수정 set 실패:', error);
        alert('키워드 수정 set 중 오류가 발생했습니다.');
        }
    });
}

// 상세 페이지 편의시설 API
function requestAmenityApi() {

    const id = document.getElementById("restaurant-id").value;

    $.ajax({
        url: `/api/restaurantamenity/restaurant/${id}`,
        type: 'GET', // 필요한 HTTP 메서드로 변경
        contentType: 'application/json', // JSON 형식으로 데이터 전송
        success: function(response) {
            // 요청 성공 시 동작
            const restaurantAmenity = response.data; // 키워드 데이터 배열

            restaurantAmenity.forEach((amenitys) => {
                let amenityHtml =
                    `
                    <p>${amenitys.amenity.name}</p>
                    `;
                // keyword 요소(내부) 끝에 추가
                $('#amenity').append(amenityHtml);
            });

            console.log('편의시설 set 완료');
        },
        error: function(xhr, status, error) {
        // 요청 실패 시 동작
        console.error('편의시설 set 실패:', error);
        alert('편의시설 set 중 오류가 발생했습니다.');
        }
    });
}

// 상세 수정 페이지 편의시설 API
function requestAmenityModifyApi() {

    const id = document.getElementById("restaurant-id").value;

    $.ajax({
        url: `/api/restaurantamenity/restaurant/${id}`,
        type: 'GET', // 필요한 HTTP 메서드로 변경
        contentType: 'application/json', // JSON 형식으로 데이터 전송
        success: function(response) {
            // 요청 성공 시 동작
            const restaurantAmenity = response.data; // 키워드 데이터 배열
            const labels = document.querySelectorAll("#amenity .form-check-label");

            restaurantAmenity.forEach((amenitys) => {
                labels.forEach((label) => {
                    if (label.textContent.trim() === amenitys.amenity.name) {
                        label.previousElementSibling.checked = true; // 해당 라벨의 체크박스를 체크

                        // 초기 상태 저장
                        label.previousElementSibling.setAttribute('data-initial-checked', 'true');
                    }
                });
            });

            console.log('편의시설 수정 set 완료');
        },
        error: function(xhr, status, error) {
        // 요청 실패 시 동작
        console.error('편의시설 수정 set 실패:', error);
        alert('편의시설 수정 set 중 오류가 발생했습니다.');
        }
    });
}
