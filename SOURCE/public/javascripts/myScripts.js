/*
 * UI Functions START
 */
function openSearchBox() {
  $('#searchBox').addClass('opened');
  $('#searchBtn').removeClass('is-info');
  $('#searchBtn').html('검색란 닫기');
  $('#searchBtn').attr('onclick', 'hideSearchBox()');
}

function hideSearchBox() {
  $('#searchBox').removeClass('opened');
  $('#searchBtn').addClass('is-info');
  $('#searchBtn').html('검색란 열기');
  $('#searchBtn').attr('onclick', 'openSearchBox()');
}

function openModalBox() {
  $('#modalBox').addClass('is-active');
}

function openModalBoxWithMapType(type) {
  $('#modalBox').addClass('is-active');

  if (type == 'take_space') {
    $('input[name="tpBuilding"]').val('');
    $('input[name="tpAddress"]').val('');
    $('input[name="tpLat"]').val('');
    $('input[name="tpLng"]').val('');
    initTPAddMap();
  } else if (type == 'path') {
    $('input[name="pathLat"]').val('');
    $('input[name="pathLng"]').val('');
    initPathAddMap();
  } else if (type == 'neighbor_space') {
    initNPAddMap();
  } else if (type == 'sequence') {
    $('input[name="tp1Val"]').val('');
    $('input[name="tp2Val"]').val('');
    $('input[name="addedNPs"]').val('');
    $('input[name="isEdit"]').val('false');
    $('#modalTitle').html('시퀀스 추가');
    updateAddableSEQList();
    initSEQAddMap();
  } else if (type == 'sequence-edit') {
    $('input[name="tp1Val"]').val('');
    $('input[name="tp2Val"]').val('');
    $('input[name="addedNPs"]').val('');
    $('input[name="isEdit"]').val('true');
    $('input[name="editTarget"]').val('');
    $('#modalTitle').html('시퀀스 변경');
    updateAddableSEQList();
    initSEQAddMap();
  }
}

function initFixModal(id, nps) {
  $('input[name="editTarget"]').val(id.toString());
  $('input[name="addedNPs"]').val(nps.split(', ').join(','));

  var np_list = JSON.parse($("#data-npList").val());
  var seq_list = JSON.parse($("#data-seqList").val());
  var np_obj = {};
  var seq_obj = {};
  for (var i = 0; i < np_list.length; i++) np_obj[np_list[i].n_NEIGHBOR_ID] = np_list[i];
  for (var i = 0; i < seq_list.length; i++) seq_obj[seq_list[i].n_SEQ_ID] = seq_list[i];
  var cur_np_lists = nps.split(', ');

  $('#seqName').val(seq_obj[id.toString()].v_SEQ_NAME);

  if (cur_np_lists.length == 2) {
    var left_np = np_obj[cur_np_lists[0]];
    var right_np = np_obj[cur_np_lists[1]];

    if (left_np.n_SPACE_1 == right_np.n_SPACE_1) {
      $('input[name="tp1Val"]').val(left_np.n_SPACE_2);
      $('input[name="tp2Val"]').val(right_np.n_SPACE_2);
    } else if (left_np.n_SPACE_1 == right_np.n_SPACE_2) {
      $('input[name="tp1Val"]').val(left_np.n_SPACE_2);
      $('input[name="tp2Val"]').val(right_np.n_SPACE_1);
    } else if (left_np.n_SPACE_2 == right_np.n_SPACE_1) {
      $('input[name="tp1Val"]').val(left_np.n_SPACE_1);
      $('input[name="tp2Val"]').val(right_np.n_SPACE_2);
    } else if (left_np.n_SPACE_2 == right_np.n_SPACE_2) {
      $('input[name="tp1Val"]').val(left_np.n_SPACE_1);
      $('input[name="tp2Val"]').val(right_np.n_SPACE_1);
    }
  } else {
    var left_np = np_obj[cur_np_lists[0]];
    var right_np = np_obj[cur_np_lists[1]];
    var cur_rest_np;

    if (left_np.n_SPACE_1 == right_np.n_SPACE_1) {
      $('input[name="tp1Val"]').val(left_np.n_SPACE_2);
      cur_rest_np = right_np.n_SPACE_2;
    } else if (left_np.n_SPACE_1 == right_np.n_SPACE_2) {
      $('input[name="tp1Val"]').val(left_np.n_SPACE_2);
      cur_rest_np = right_np.n_SPACE_1;
    } else if (left_np.n_SPACE_2 == right_np.n_SPACE_1) {
      $('input[name="tp1Val"]').val(left_np.n_SPACE_1);
      cur_rest_np = right_np.n_SPACE_2;
    } else if (left_np.n_SPACE_2 == right_np.n_SPACE_2) {
      $('input[name="tp1Val"]').val(left_np.n_SPACE_1);
      cur_rest_np = right_np.n_SPACE_1;
    }

    for (var i = 1; i < cur_np_lists.length; i++) {
      if (cur_rest_np == np_obj[cur_np_lists[i]].n_SPACE_1) {
        cur_rest_np = np_obj[cur_np_lists[i]].n_SPACE_2;
      } else {
        cur_rest_np = np_obj[cur_np_lists[i]].n_SPACE_1;
      }
    }

    $('input[name="tp2Val"]').val(cur_rest_np);
  }

  updateAddableSEQList();
}

function openModalBoxWithMap() {
  $('#modalBox').addClass('is-active');
  initAddCCTVMap();
}

function hideModalBox() {
  $('#modalBox').removeClass('is-active');
}

function openTargetModalBox(id) {
  $('#' + id).addClass('is-active');
}

function hideTargetModalBox(id) {
  $('#' + id).removeClass('is-active');
}
function initModalBox(data) {
  var npList = JSON.parse(data);

  let dataHtml = "";
  let dataHtml2 = "";

  $('#addedNPList').html(dataHtml);

  for(var i = 0; i < npList.length; i++) {
    dataHtml2 += getAddableNPListHTML(npList[i]);
  }
  $('#addableNPList').html(dataHtml2);
  $("#addedNPListNum").val('0');
}
function selectBtn(element) {
  $(element).addClass('is-info');
  $(element).attr('onclick', 'deselectBtn(this)');
}

function deselectBtn(element) {
  $(element).removeClass('is-info');
  $(element).attr('onclick', 'selectBtn(this)');
}

function saveOptions(type) {
  var selected_count = 0;
  var new_value = "";

  $('#'+type+'Modal').find('.select-button.is-info').each(function() {
    selected_count += 1;

    if (new_value == "") {
      new_value += $(this).attr('id').replace(type + 'Btn', '');
    } else {
      new_value += ",!," + $(this).attr('id').replace(type + 'Btn', '');
    }
  });

  $('#'+type+'SelectBtn').html(selected_count.toString() + "개 선택됨");

  if (selected_count > 0) {
    $('#'+type+'SelectBtn').addClass('is-success');
  } else {
    $('#'+type+'SelectBtn').removeClass('is-success');
  }

  $('#'+type+'SelectVal').val(new_value);

  hideTargetModalBox(type+'Modal');
}

function openChangeModal(user_id, user_name) {
  openTargetModalBox('pwModal');
  $('#pwChTitle').html("비밀번호 변경; " + user_name);
  $('#pwChBtn').attr('onclick', 'changePw('+user_id+')')
}

function makeCCTVList() {
  var searchKeyword = $('input[name="cctvSearchInput"]').val();

  $('a.panel-block').each(function() {
    if ($(this).text().includes(searchKeyword)) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}

function setNPSelectInput(type, element) {
  $('input[name="npSelect' + type + '"]').val($(element).find('option:selected').attr('name'));

  initNPAddMap();
}




function openAdmCCTVM(adm_id, cctvs) {
  let cctv_list = cctvs.split(',!,');

  $('#deleteCCTVList').html('');
  $('#addCCTVList').html('');

  $.ajax({
    url: "/api/cctv/",
	  type: "post",
    async: false,
    success : function(data) {
      for (var i = 0; i < data.length; i++) {
        if (cctv_list.indexOf(data[i].n_CCTV_ID.toString()) != -1) {
          $('#deleteCCTVList').append('<option value="' + data[i].n_CCTV_ID.toString() + '">CCTV[' + data[i].v_MODEL + ']</option>');
        } else {
          $('#addCCTVList').append('<option value="' + data[i].n_CCTV_ID.toString() + '">CCTV[' + data[i].v_MODEL + ']</option>');
        }
      }

      $('#admCCTVBtn').attr('onclick', 'changeCCTV('+adm_id+')');
      openTargetModalBox('admCCTVModal');
    }
	});
}


function searchTP(type) {
  var conditions = {
    'addr_cond': $('#addrCond' + (type+1)).val(),
    'b_cond': $('#bCond' + (type+1)).val(),
    'f_cond': $('#fCond' + (type+1)).val(),
    's_cond': $('#sCond' + (type+1)).val()
  };

  $('#TPTable' + type.toString()).children().each(function() {
    let isHidden = false;

    if (!isHidden && !$(this).find('td[name="address"]').html().includes(conditions.addr_cond) && conditions.addr_cond != '') {
      $(this).attr('style', 'display:none;');
      isHidden = true;
    }

    if (!isHidden && !$(this).find('td[name="building"]').html().includes(conditions.b_cond) && conditions.b_cond != '') {
      $(this).attr('style', 'display:none;');
      isHidden = true;
    }

    if (!isHidden && !$(this).find('td[name="floor"]').html().includes(conditions.f_cond) && conditions.f_cond != '') {
      $(this).attr('style', 'display:none;');
      isHidden = true;
    }

    if (!isHidden && !$(this).find('td[name="site"]').html().includes(conditions.s_cond) && conditions.s_cond != '') {
      $(this).attr('style', 'display:none;');
      isHidden = true;
    }

    if (!isHidden) {
      $(this).attr('style', '');
    }
  });
}

function showStatisticsModal(name) {
  $('p[name="statisticsName"]').html('통계 | ' + name);
  $('#statisticsModal').addClass('is-active');

  loadStatisticsInfo(name);
}

function showLineChart(id, dataset, data_length) {
  // object num
  var ctx = document.getElementById(id).getContext('2d');

  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.apply(null, {length: data_length + 2}).map(Number.call, Number),
      datasets: dataset
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          display: false,
          scaleLabel: {
            display: true,
            labelString: "TimeStamp"
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Value'
          }
        }]
      }
    }
  });
}

function hideStatisticsModal() {
  $('#statisticsModal').removeClass('is-active');
}

function insertFileName() {
  $('#fileNameLabel').html($('#fileInput').val());
}

function updateAddableSEQList() {
  var tp1_val = $('input[name="tp1Val"]').val();
  var tp2_val = $('input[name="tp2Val"]').val();
  var np_list = JSON.parse($('#data-npList').val());
  var np_obj = {};

  for (var i = 0; i < np_list.length; i++) {
    np_obj[np_list[i].n_NEIGHBOR_ID] = np_list[i];
  }

  var addedNPList = $('input[name="addedNPs"]').val().split(',');
  var addedNPNum = addedNPList.length;

  if ($('input[name="addedNPs"]').val() == 0) {
    addedNPNum = 0;
  }

  $('#addedNPList').html('');

  for (var i = 0; i < addedNPNum; i++) {
    if (i == 0 || i == addedNPNum - 1) {
      $('#addedNPList').append(getAddedNPListHTML(np_obj[addedNPList[i]], i, "last"));
    } else {
      $('#addedNPList').append(getAddedNPListHTML(np_obj[addedNPList[i]], i, ""));
    }
  }

  $('#addableNPList').html('');

  for (let i = 0; i < np_list.length; i++) {
    if (addedNPNum == 0) {
      $('#addableNPList').append(getAddableNPListHTML(np_list[i]));
    } else {
      if (!addedNPList.includes(np_list[i].n_NEIGHBOR_ID.toString())) {
        if (tp1_val == '' && tp2_val == '') {
          $('#addableNPList').append(getAddableNPListHTML(np_list[i]));
        } else if ((np_list[i].n_SPACE_1 == tp1_val) || (np_list[i].n_SPACE_2 == tp1_val) || (np_list[i].n_SPACE_1 == tp2_val) || (np_list[i].n_SPACE_2 == tp2_val)) {
          if (!((np_list[i].n_SPACE_1 == tp1_val && np_list[i].n_SPACE_2 == tp2_val) || (np_list[i].n_SPACE_2 == tp1_val && np_list[i].n_SPACE_1 == tp2_val)))
            $('#addableNPList').append(getAddableNPListHTML(np_list[i]));
        }
      }
    }
  }

  initSEQAddMap();
}

function appendAddableSEQList() {
  var tp1_val = $('input[name="tp1Val"]').val();
  var tp2_val = $('input[name="tp2Val"]').val();

  var selectedNP = $('#addableNPList option:selected');
  var addedNP = $('input[name="addedNPs"]').val();


  if (selectedNP.length == 0) {
    alert('추가할 이웃공간이 없습니다.');
    return;
  }

  selectedNP = selectedNP.val();

  var selectedNP = JSON.parse(selectedNP);

  if (addedNP == '') {
    $('input[name="tp1Val"]').val(selectedNP.n_SPACE_1);
    $('input[name="tp2Val"]').val(selectedNP.n_SPACE_2);
    $('input[name="addedNPs"]').val(selectedNP.n_NEIGHBOR_ID.toString());
  } else {
    if (tp1_val == selectedNP.n_SPACE_1) {
      $('input[name="tp1Val"]').val(selectedNP.n_SPACE_2);

      $('input[name="addedNPs"]').val(selectedNP.n_NEIGHBOR_ID.toString() + ',' + addedNP);
    } else if (tp1_val == selectedNP.n_SPACE_2) {
      $('input[name="tp1Val"]').val(selectedNP.n_SPACE_1);
      $('input[name="addedNPs"]').val(selectedNP.n_NEIGHBOR_ID.toString() + ',' + addedNP);
    } else if (tp2_val == selectedNP.n_SPACE_1) {
      $('input[name="tp2Val"]').val(selectedNP.n_SPACE_1);
      $('input[name="addedNPs"]').val(addedNP + ',' + selectedNP.n_NEIGHBOR_ID.toString());
    } else if (tp2_val == selectedNP.n_SPACE_2) {
      $('input[name="tp2Val"]').val(selectedNP.n_SPACE_2);
      $('input[name="addedNPs"]').val(addedNP + ',' + selectedNP.n_NEIGHBOR_ID.toString());
    }
  }

  updateAddableSEQList();
}

function deleteAddedSEQList(np_id) {
  var np_list = JSON.parse($('#data-npList').val());
  var np_obj = {};

  for (var i = 0; i < np_list.length; i++) {
    np_obj[np_list[i].n_NEIGHBOR_ID] = np_list[i];
  }

  var np_info = np_obj[np_id];

  var tp1_val = $('input[name="tp1Val"]').val();
  var tp2_val = $('input[name="tp2Val"]').val();
  var added_nps = $('input[name="addedNPs"]').val().split(',');

  if (added_nps[0] == np_info.n_NEIGHBOR_ID) {
    if (tp1_val == np_info.n_SPACE_1) {
      $('input[name="tp1Val"]').val(np_info.n_SPACE_2);
    } else if (tp1_val == np_info.n_SPACE_2) {
      $('input[name="tp1Val"]').val(np_info.n_SPACE_1);
    }

    var new_added_nps = "";
    for (let i = 0; i < added_nps.length - 1; i++) {
      if (new_added_nps == "") new_added_nps += added_nps[i];
      else new_added_nps += "," + added_nps[i];
    }
    $('input[name="addedNPs"]').val(new_added_nps);

  } else if (added_nps[added_nps.length - 1] == np_info.n_NEIGHBOR_ID) {
    if (tp2_val == np_info.n_SPACE_1) {
      $('input[name="tp2Val"]').val(np_info.n_SPACE_2);
    } else if (tp2_val == np_info.n_SPACE_2) {
      $('input[name="tp2Val"]').val(np_info.n_SPACE_1);
    }

    var new_added_nps = "";
    for (let i = 0; i < added_nps.length - 1; i++) {
      if (new_added_nps == "") new_added_nps += added_nps[i+1];
      else new_added_nps += "," + added_nps[i+1];
    }
    $('input[name="addedNPs"]').val(new_added_nps);
  }

  updateAddableSEQList();
}

function searchMFile() {
  var mf_cond = {
    nameCond: $('input[name="nameCond"]').val(),
    cctvCond: $('input[name="cctvCond"]').val(),
    tpAddressCond: $('input[name="tpAddressCond"]').val(),
    tpBuildingCond: $('input[name="tpBuildingCond"]').val(),
    tpFloorCond: $('input[name="tpFloorCond"]').val(),
    tpSiteCond: $('input[name="tpSiteCond"]').val(),
    seqCond: $('input[name="seqCond"]').val(),
    startTimeCond: $('input[name="startTimeCond"]').val(),
    endTimeCond: $('input[name="endTimeCond"]').val()
  };

  $.ajax({
    type: 'post',
    url: '/api/file/movie/search',
    data: mf_cond,
    success: function(data) {
      $('#dataTable').html('');

      data.forEach(function(ele) {
        $('#dataTable').append(getMFListHTML(ele));
      });
    }
  });
}


function searchLFile() {
  var lf_cond = {
    nameCond: $('input[name="nameCond"]').val(),
    movieCond: $('input[name="movieCond"]').val(),
    cctvCond: $('input[name="cctvCond"]').val(),
    tpAddressCond: $('input[name="tpAddressCond"]').val(),
    tpBuildingCond: $('input[name="tpBuildingCond"]').val(),
    tpFloorCond: $('input[name="tpFloorCond"]').val(),
    tpSiteCond: $('input[name="tpSiteCond"]').val(),
    seqCond: $('input[name="seqCond"]').val(),
    startTimeCond: $('input[name="startTimeCond"]').val(),
    endTimeCond: $('input[name="endTimeCond"]').val()
  };

  $.ajax({
    type: 'post',
    url: '/api/file/log/search',
    data: lf_cond,
    success: function(data) {
      $('#dataTable').html('');

      data.forEach(function(ele) {
        $('#dataTable').append(getLFListHTML(ele));
      });
    }
  });
}


/*
 * UI Functions END
 */



/*
 * REQ Functions START
 */
function signup() {
  if ($('#login_id').val() == '') {
    alert('아이디를 입력해주세요.');
    return;
  }

  if ($('#login_pwd').val() == '') {
    alert('비밀번호를 입력해주세요.');
    return;
  }

  $.ajax({
    url: "/api/auth/signup",
	  type: "post",
	  data: {
      'login_id' : $('#login_id').val(),
      'login_pwd' : $('#login_pwd').val(),
      'login_name' : $('#login_name').val(),
      'login_phone' : $('#login_phone1').val() + "-" + $('#login_phone2').val() + "-" + $('#login_phone3').val()
    },
    success : function(data) {
      if (parseInt(data.trim()) == 0) {
        alert('일반관리자를 성공적으로 추가하였습니다.');
        location.reload();
      } else if (parseInt(data.trim()) == 1062) {
        alert('아이디가 중복입니다.');
      } else {
        alert('ERROR: ' + data.trim());
      }
    }
	});
}

function deleteLFBeforeDate() {
  var confirmValue = confirm('해당 날짜 이전 로그파일들을 삭제하시겠습니까?');

  if ($('input[name="targetDate"]').val() == '') {
    alert('기준 시간을 입력해주세요.');
    return;
  }

  if (confirmValue) {
    $.ajax({
      url: "/api/file/log/deleteBeforeDate",
  	  type: "post",
  	  data: {
        targetDate : $('input[name="targetDate"]').val(),
      },
      success : function(data) {
        if (parseInt(data.trim()) != 0) {
          alert(data.trim() + '개의 로그파일 및 통계데이터를 삭제하였습니다.');
          location.reload();
        } else {
          alert(data.trim() + '개의 로그파일을 삭제하였습니다.');
        }
      }
  	});
  }
}


function deleteMFBeforeDate() {
  var confirmValue = confirm('해당 날짜 이전 영상파일들을 삭제하시겠습니까?');

  if ($('input[name="targetDate"]').val() == '') {
    alert('기준 시간을 입력해주세요.');
    return;
  }

  if (confirmValue) {
    $.ajax({
      url: "/api/file/movie/deleteBeforeDate",
  	  type: "post",
  	  data: {
        targetDate : $('input[name="targetDate"]').val(),
      },
      success : function(data) {
        if (parseInt(data.trim()) != 0) {
          alert(data.trim() + '개의 영상파일, 로그파일, 통계데이터를 삭제하였습니다.');
          location.reload();
        } else {
          alert(data.trim() + '개의 영상파일을 삭제하였습니다.');
        }
      }
  	});
  }
}



function changePw() {
  if ($('#login_pwd_ch').val() == '') {
    alert('비밀번호를 입력해주세요.');
    return;
  }

  $.ajax({
    url: "/api/auth/changePw",
	  type: "post",
	  data: {
      'login_pwd' : $('#login_pwd_ch').val()
    },
    success : function(data) {
      if (parseInt(data.trim()) == 0) {
        alert('비밀번호 변경을 성공적으로 수행하였습니다.');
        hideTargetModalBox('pwModal');
        $('#login_pwd_ch').val('');
      } else if (parseInt(data.trim()) == 1062) {
        alert('아이디가 중복입니다.');
      } else {
        alert('ERROR: ' + data.trim());
      }
    }
	});
}

function checkPw(admin_id) {

  if($('#checkPw').val() == '') {
    alert('비밀번호를 입력해주세요.');
    return;
  }
  $.ajax({
    url: "/api/info/check/",
    type: "post",
    data: {
      'checkedPw': $('#checkPw').val(),
      'admin_id': admin_id
    },
    success: function(data) {
      if(data.trim() == '1') {
        isChecked = '1';
        location.href = "/info/manage";
      } else {
        alert("비밀번호가 맞지 않습니다.");
      }
    }
  });
}

function changeInfo(admin_id) {
  if ($('#name-input').val() == '') {
    alert('이름을 입력해주세요.');
    return;
  } else if($('#phoneNum-input').val() == '') {
    alert('전화번호를 입력해주세요.');
    return;
  }

  $.ajax({
    url: "/api/info/change",
    type: "post",
    data: {
      'new_user_name' : $('#name-input').val(),
      'new_user_phoneNum' : $('#phoneNum-input').val(),
      'admin_id' : admin_id
    },
    success : function(data) {
      if (parseInt(data.trim()) == 0) {
        alert('정보가 변경되었습니다.');
        location.replace('/info/show');
      } else {
        alert('ERROR: ' + data.trim());
      }
    }
  });
}


function searchUser() {
  // conditions
  $.ajax({
    url: "/api/auth/search",
	  type: "post",
	  data: {
      'id_cond' : $('#idCond').val(),
      'name_cond' : $('#nameCond').val(),
      'cctv_cond' : $('#cctvSelectVal').val(),
      'join_cond1' : $('#joinCond1').val(),
      'join_cond2' : $('#joinCond2').val(),
      'recent_cond1' : $('#recentCond1').val(),
      'recent_cond2' : $('#recentCond2').val()
    },
    success : function(data) {
      let dataHtml = '';
      for (var i = 0; i < data.length; i++) {
        dataHtml += getUserListHTML(data[i]);
      }

      $('#dataTable').html(dataHtml);
    }
	});
}


function deleteUser(admin_id, salt) {
  var confirmValue = confirm('해당 관리자를 삭제하시겠습니까?');

  if (confirmValue) {
    $.ajax({
      url: "/api/auth/delete",
      type: "post",
      data: {
        'admin_id' : admin_id,
        'salt': salt
      },
      success : function(data) {
        if (parseInt(data.trim()) == 0) {
          alert('삭제되지 않았습니다. html 코드 수정을 확인해주세요.');
        } else {
          alert('성공적으로 삭제되었습니다!');
          location.reload();
        }
      }
    });
  }
}

function addCCTV() {
  var cctv_data = {
    'cctv_model': $('#addModel').val(),
    'cctv_date': $('#addDate').val(),
    'cctv_adm': $('#addAdm').val(),
    'cctv_tp': $('#addTP').val(),
    'cctv_lng': $('input[name="cctvLng"]').val(),
    'cctv_lat': $('input[name="cctvLat"]').val()
  };

  // validation
  if (cctv_data.cctv_model == '') {
    alert('모델명을 입력해주세요.');
    return;
  }

  if (cctv_data.cctv_date == '') {
    alert('설치날짜를 입력해주세요.');
    return;
  }

  if (cctv_data.cctv_adm.length == 0) {
    alert('관리자를 한 명 이상 선택해주세요.');
    return;
  }

  if (cctv_data.cctv_tp.length == 0) {
    alert('촬영공간을 한 곳 이상 선택해주세요.');
    return;
  }

  if (cctv_data.cctv_lng == '' || cctv_data.cctv_lat == '') {
    alert('지도에서 CCTV를 선택해주세요.');
    return;
  }


  // add SUPER ADMIN
  cctv_data.cctv_adm.push("1");

  cctv_data.cctv_adm = JSON.stringify(cctv_data.cctv_adm);
  cctv_data.cctv_tp = JSON.stringify(cctv_data.cctv_tp);

  $.ajax({
    url: "/api/cctv/add",
    type: "post",
    data: cctv_data,
    success : function(data) {
      if (parseInt(data.trim()) == 0) {
        alert('성공적으로 추가되었습니다!');
        location.reload();
      } else {
      }
    }
  });
}


function searchCCTV() {
  var cctv_data = {
    'cctv_model': $('#searchModel').val(),
    'cctv_date1': $('#searchDate1').val(),
    'cctv_date2': $('#searchDate2').val(),
    'cctv_adm': $('#admSelectVal').val()
  };

  $.ajax({
    url: "/api/cctv/search",
    type: "post",
    data: cctv_data,
    success : function(data) {
      let dataHtml = '';
      for (var i = 0; i < data.length; i++) {
        dataHtml += getCCTVListHTML(data[i]);
      }

      $('#dataTable').html(dataHtml);
    }
  });
}

function deleteCCTV(cctv_id) {
  var confirmValue = confirm('해당 CCTV를 삭제하시겠습니까?');

  if (confirmValue) {
    $.ajax({
      url: "/api/cctv/delete",
      type: "post",
      data: {
        'cctv_id': cctv_id
      },
      success : function(data) {
        if (parseInt(data.trim()) == 0) {
          alert('삭제되지 않았습니다. html 코드 수정을 확인해주세요.');
        } else {
          alert('성공적으로 삭제되었습니다!');
          location.reload();
        }
      }
    });
  }
}

function changeCCTV(adm_id) {
  var cctv_data = {
    'adm_id': adm_id,
    'add_list': $('#addCCTVList').val(),
    'delete_list': $('#deleteCCTVList').val(),
    'add_list_cnt': $('#addCCTVList').val().length,
    'delete_list_cnt': $('#deleteCCTVList').val().length
  };

  var confirmValue = confirm('해당 관리자에게 ' + cctv_data.add_list.length + '개의 CCTV 권한을 추가하고, ' + cctv_data.delete_list.length + '개의 CCTV 권한을 삭제하시겠습니까?');

  if (confirmValue) {
    $.ajax({
      url: "/api/auth/changeCCTV",
      type: "post",
      data: cctv_data,
      success : function(data) {
        if (parseInt(data.trim()) != 0) {
          alert('수정되지 않았습니다. html 코드 수정을 확인해주세요.');
        } else {
          alert('성공적으로 수정되었습니다!');
          location.reload();
        }
      }
    });
  }
}

function deleteTP(tp_id, cctv_id) {
  var confirmValue = confirm('해당 촬영공간을 CCTV에서 삭제하시겠습니까?');

  if (confirmValue) {
    $.ajax({
      url: "/api/takeSpace/delete",
      type: "post",
      data: {
        'tp_id': tp_id,
        'cctv_id': cctv_id
      },
      success : function(data) {
        if (data != 0) {
          alert('성공적으로 삭제되었습니다!');
          location.reload();
        } else {
          alert('삭제에 실패하였습니다.');
        }
      }
    });
  }
}


function appendTP(tp_id, cctv_id) {
  var confirmValue = confirm('해당 촬영공간을 CCTV에 추가하시겠습니까?');

  if (confirmValue) {
    $.ajax({
      url: "/api/takeSpace/append",
      type: "post",
      data: {
        'tp_id': tp_id,
        'cctv_id': cctv_id
      },
      success : function(data) {
        if (data != 0) {
          alert('성공적으로 추가되었습니다!');
          location.reload();
        } else {
          alert('추가에 실패하였습니다.');
        }
      }
    });
  }
}

function appendNP(tp_id, cctv_id) {
  var confirmValue = confirm('해당 이웃공간을 추가하시겠습니까?');

  var np_data = {
    np_name : $('input[name="nameSelect"]').val(),
    np_tp1 : $('select[name="tpSelect1"] option:selected').val(),
    np_tp2 : $('select[name="tpSelect2"] option:selected').val(),
    np_path : $('select[name="pathSelect"] option:selected').val(),
    np_tp1_coord : $('select[name="tpSelect1"] option:selected').attr('name'),
    np_tp2_coord : $('select[name="tpSelect2"] option:selected').attr('name'),
    np_path_coord : $('select[name="pathSelect"] option:selected').attr('name')
  };

  if (np_data.np_name == '') {
    alert('이름을 입력해주세요.');
    return;
  }

  if (np_data.np_tp1 == np_data.np_tp2) {
    alert("두 촬영공간이 같습니다.");
    return;
  }

  if (confirmValue) {
    $.ajax({
      url: "/api/neighbor/append",
      type: "post",
      data: np_data,
      success : function(data) {
        if (parseInt(data.trim()) == 0) {
          alert('성공적으로 추가되었습니다!');
          location.reload();
        } else if (parseInt(data.trim()) == -1) {
          alert('두 촬영공간과 경로를 공유하는 이웃공간이 이미 존재합니다.');
        } else if (parseInt(data.trim()) == 1) {
          alert('두 촬영공간과 경로가 이어지지 않습니다.');
        } else {
          alert('추가에 실패하였습니다.');
        }
      }
    });
  }
}

function allStatisticsDownload() {
  var confirmValue = confirm('전체 통계 수치를 다운로드하시겠습니까?');

  if (confirmValue) {
    $.ajax({
      url: "/api/file/log/download",
      type: "post",
      success : function(data) {
        location.href = '/upload/' + data.trim();
      }
    });
  }
}

function uploadFile() {
  $('.modal-upwall').addClass('opened');

  if (parseInt($('#cctvSelectBox option:selected').val()) == -1) {
    alert('CCTV를 선택해주세요!');
    $('.modal-upwall').removeClass('opened');
    return;
  }

  if (parseInt($('#tpSelectBox option:selected').val()) == -1) {
    alert('촬영공간을 선택해주세요!');
    $('.modal-upwall').removeClass('opened');
    return;
  }

  if ($('input[name="startDate"]').val() == '') {
    alert('시작시간을 입력해주세요');
    $('.modal-upwall').removeClass('opened');
    return;
  }

  if ($('input[name="endDate"]').val() == '') {
    alert('끝시간을 입력해주세요');
    $('.modal-upwall').removeClass('opened');
    return;
  }


  $('#tpSelectName').val($('#tpSelectBox option:selected').html());

  if ($('#fileInput').val() == '') {
    alert('업로드할 파일을 선택해주세요!');
    $('.modal-upwall').removeClass('opened');
    return;
  }

  let file_extension = $('#fileInput').val().split('.');
  file_extension = file_extension[file_extension.length-1];

  if (!(file_extension == "avi" || file_extension == "mp4" || file_extension == "webm" || file_extension == "ogg")) {
    alert('확장자가 avi, mp4, webm, ogg인 파일만 업로드 가능합니다.');
    $('.modal-upwall').removeClass('opened');
    return;
  }

  $('#uploadForm').ajaxSubmit({
    type: 'post',
    url: '/api/file/movie/upload',
    data: {
      'cctv_id': $('#cctvSelectBox option:selected').val(),
      'tp_id': $('#tpSelectBox option:selected').val(),
    },
    processData: false,  // tell jQuery not to process the data
    contentType: false,   // tell jQuery not to set contentType
    async: true,
    error: function(xhr) {
      //status('Error: ' + xhr.status);
      alert('업로드를 실패하였습니다!');
      $('.modal-upwall').removeClass('opened');
    },
    success: function(response) {
      //$("#status").empty().text(response);
      if (parseInt(response) == 1) {
        alert('업로드를 완료하였습니다!');
        location.reload();
      } else {
        alert('업로드를 실패하였습니다!');
        $('.modal-upwall').removeClass('opened');
      }
    }
  });

}

function uploadCCTVFile() {
  $('.modal-upwall').addClass('opened');

  if ($('#fileInput').val() == '') {
    alert('업로드할 파일을 선택해주세요!');
    $('.modal-upwall').removeClass('opened');
    return;
  }

  let file_extension = $('#fileInput').val().split('.');
  file_extension = file_extension[file_extension.length-1];

  if (!(file_extension == "csv")) {
    alert('확장자가 csv인 파일만 업로드 가능합니다.');
    $('.modal-upwall').removeClass('opened');
    return;
  }


  $('#uploadForm').ajaxSubmit({
    type: 'post',
    url: '/api/cctv/addCSV',
    processData: false,  // tell jQuery not to process the data
    contentType: false,   // tell jQuery not to set contentType
    async: true,
    error: function(xhr) {
      //status('Error: ' + xhr.status);
      alert('업로드를 실패하였습니다!');
      $('.modal-upwall').removeClass('opened');
    },
    success: function(response) {
      //$("#status").empty().text(response);
      if (parseInt(response) == 0) {
        alert('업로드를 완료하였습니다!');
        location.reload();
      } else {
        alert('업로드를 실패하였습니다!');
        $('.modal-upwall').removeClass('opened');
      }
    }
  });
}

function uploadLogFile() {
  $('.modal-upwall').addClass('opened');

  if (parseInt($('#movieSelectBox option:selected').val()) == -1) {
    alert('영상파일을 선택해주세요!');
    $('.modal-upwall').removeClass('opened');
    return;
  }

  if ($('#fileInput').val() == '') {
    alert('업로드할 파일을 선택해주세요!');
    $('.modal-upwall').removeClass('opened');
    return;
  }

  let file_extension = $('#fileInput').val().split('.');
  file_extension = file_extension[file_extension.length-1];

  if (!(file_extension == "csv")) {
    alert('확장자가 csv인 파일만 업로드 가능합니다.');
    $('.modal-upwall').removeClass('opened');
    return;
  }


  $('#uploadForm').ajaxSubmit({
    type: 'post',
    url: '/api/file/log/upload',
    processData: false,  // tell jQuery not to process the data
    contentType: false,   // tell jQuery not to set contentType
    async: true,
    error: function(xhr) {
      //status('Error: ' + xhr.status);
      alert('업로드를 실패하였습니다!');
      $('.modal-upwall').removeClass('opened');
    },
    success: function(response) {
      //$("#status").empty().text(response);
      if (parseInt(response) == 1) {
        alert('업로드를 완료하였습니다!');
        location.reload();
      } else {
        alert('업로드를 실패하였습니다!');
        $('.modal-upwall').removeClass('opened');
      }
    }
  });
}


function changeSLTP() {
  if (parseInt($('#cctvSelectBox option:selected').val()) == -1) {
    $('#tpSelectBox').html('<option value="-1">촬영공간을 선택해주세요.</option>');
    return;
  }

  $('#tpSelectBox').html('<option value="-1">촬영공간을 선택해주세요.</option>');

  $.ajax({
    url: "/api/takeSpace/searchByCCTV",
    type: "post",
    data: {
      'cctv_id': $('#cctvSelectBox option:selected').val()
    },
    async: false,
    success : function(data) {
      data.map(function (tp) {
        $('#tpSelectBox').append('<option value="' + tp.n_TAKE_SPACE_ID + '">' + tp.v_ADDRESS + ' ' + tp.v_BUILDING + ' ' + tp.v_FLOOR + ' ' + tp.v_SITE + '</option>');
      });
    }
  });
}

function addTp() {
  if ($('input[name="tpLng"]').val() == '' || $('input[name="tpLat"]').val() == '') {
    alert('지도에서 촬영공간을 선택해주세요.');
    return;
  }

  if ($('input[name="tpAddress"]').val() == '') {
    alert('주소를 입력해주세요.');
    return;
  }
  if ($('input[name="tpBuilding"]').val() == '') {
    alert('건물을 입력해주세요.');
    return;
  }
  if ($('input[name="tpFloor"]').val() == '') {
    alert('층수를 입력해주세요.');
    return;
  }
  if ($('input[name="tpSite"]').val() == '') {
    alert('위치를 입력해주세요.');
    return;
  }

  $.ajax({
    url: "/api/takeSpace/appendTP",
    type: "post",
    data: {
      tp_lng : $('input[name="tpLng"]').val(),
      tp_lat : $('input[name="tpLat"]').val(),
      tp_address : $('input[name="tpAddress"]').val(),
      tp_building : $('input[name="tpBuilding"]').val(),
      tp_floor : $('input[name="tpFloor"]').val(),
      tp_site : $('input[name="tpSite"]').val()
    },
    success : function(data) {
      if (parseInt(data.trim()) != 0) {
        alert('성공적으로 추가되었습니다!');
        location.reload();
      } else {
        alert('추가에 실패하였습니다.');
      }
    }
  });
}


function delTP(id) {
  var confirmValue = confirm('해당 촬영공간을 삭제하시겠습니까?');

  if (confirmValue) {
    $.ajax({
      url: "/api/takeSpace/deleteTP",
      type: "post",
      data: {
        tp_id : id
      },
      success : function(data) {
        if (parseInt(data.trim()) != 0) {
          alert('성공적으로 삭제되었습니다!');
          location.reload();
        } else {
          alert('삭제에 실패하였습니다.');
        }
      }
    });
  }
}


function addPath() {
  var pathData = {
    path_name : $('input[name="pathName"]').val(),
    path_location : $('input[name="pathLocation"]').val(),
    path_start_lat : $('input[name="pathLatStart"]').val(),
    path_start_lng : $('input[name="pathLngStart"]').val(),
    path_end_lat : $('input[name="pathLatEnd"]').val(),
    path_end_lng : $('input[name="pathLngEnd"]').val()
  };

  if (pathData.path_start_lat == '' || pathData.path_start_lng == '' || pathData.path_end_lat == '' || pathData.path_end_lng == '') {
    alert('지도에서 경로 양측을 선택해주세요.');
    return;
  }


  if (pathData.path_name == '') {
    alert('이름을 입력해주세요.');
    return;
  }

  if (pathData.path_location == '') {
    alert('위치를 입력해주세요.');
    return;
  }


  $.ajax({
    url: "/api/path/addPath",
    type: "post",
    data: pathData,
    success: function(data) {
      if (parseInt(data.trim()) > 0) {
        alert('성공적으로 추가되었습니다.');
        location.reload();
      } else {
        alert('추가에 실패하였습니다.');
      }
    }
  });
}

function deletePath(id) {
  var confirmValue = confirm('해당 경로를 삭제하시겠습니까?');

  if (confirmValue) {
    $.ajax({
      url: "/api/path/deletePath",
      type: "post",
      data: {
        path_id : id
      },
      success: function(data) {
        if (parseInt(data.trim()) > 0) {
          alert('성공적으로 삭제되었습니다.');
          location.reload();
        } else {
          alert('삭제에 실패하였습니다.');
        }
      }
    });
  }
}


function deleteMF(mf_name) {
  var confirmValue = confirm('해당 영상파일을 삭제하시겠습니까? 관련된 로그파일도 삭제됩니다.');

  if (confirmValue) {
    $.ajax({
      url: '/api/file/movie/delete',
      type: 'post',
      data: {
        mf_name: mf_name
      },
      async: true,
      success: function(data) {
        if (parseInt(data) > 0) {
          alert('성공적으로 삭제되었습니다.');
          location.reload();
        } else {
          alert('삭제에 실패하였습니다.');
        }
      }
    });
  }
}


function deleteLF(lf_name) {
  var confirmValue = confirm('해당 로그파일을 삭제하시겠습니까?');

  if (confirmValue) {
    $.ajax({
      url: '/api/file/log/delete',
      type: 'post',
      data: {
        lf_name: lf_name
      },
      async: true,
      success: function(data) {
        if (parseInt(data) > 0) {
          alert('성공적으로 삭제되었습니다.');
          location.reload();
        } else {
          alert('삭제에 실패하였습니다.');
        }
      }
    });
  }
}

function addSequence() {
  var seqName = $("#seqName").val();
  var npNumToAdd = $("input[name='addedNPs']").val().split(',').length;

  if ($("input[name='addedNPs']").val() == '') npNumToAdd = 0;

  var npListToAdd = [];

  if(seqName == '') {
    alert("시퀀스 이름을 입력해주세요.");
    return;
  }
  if(npNumToAdd < 2) {
    alert("시퀀스를 구성하기 위한 최소의 이웃공간은 2개입니다.");
    return;
  }

  for(var i = 0; i < npNumToAdd; i++) {
      npListToAdd[i] = JSON.parse($("#addedNP"+i).val());
  }

  if ($('input[name="isEdit"]').val() == "false") {
    $.ajax({
      url: '/api/sequence/append',
      type: 'post',
      data: {
        np_list_add : JSON.stringify($("input[name='addedNPs']").val().split(',')),
        seq_name : seqName
      },
      success: function(data) {
        if (parseInt(data.trim()) == 0) {
          alert('성공적으로 추가되었습니다.');
          location.reload();
        } else if (parseInt(data.trim()) == -1){
          alert('같은 시퀀스가 이미 존재합니다.');
        } else if (parseInt(data.trim()) == -2) {
          alert('같은 이름을 가진 시퀀스가 존재합니다.');
        } else {
          alert('추가에 실패했습니다.');
        }
      }
    });
  } else {
    $.ajax({
      url: '/api/sequence/update',
      type: 'post',
      data: {
        np_list_add : JSON.stringify($("input[name='addedNPs']").val().split(',')),
        seq_name : seqName,
        seq_id : $('input[name="editTarget"]').val()
      },
      success: function(data) {
        if (parseInt(data.trim()) == 0) {
          alert('성공적으로 변경되었습니다.');
          location.reload();
        } else if (parseInt(data.trim()) == -1){
          alert('같은 시퀀스가 이미 존재합니다.');
        } else if (parseInt(data.trim()) == -2) {
          alert('같은 이름을 가진 시퀀스가 존재합니다.');
        } else {
          alert('변경에 실패했습니다.');
        }
      }
    });
  }
}

function deleteSequence(seq_id) {
  var confirmValue = confirm('해당 시퀀스를 삭제하시겠습니까?');
  if (confirmValue) {
    $.ajax({
      url: '/api/sequence/delete',
      type: 'post',
      data: {
        'seq_id' : seq_id
      },
      async: true,
      success: function(data) {
        if (parseInt(data) == 0) {
          alert('성공적으로 삭제되었습니다.');
          location.reload();
        } else {
          alert('삭제에 실패하였습니다.');
        }
      }
    });
  }
}

function updateSequence() {
  var seq_id = $("#seqId").val();
  var seqName = $("#seqName_fix").val();
  var npNumToAdd = parseInt($("#existNPListNum").val());
  var npListToAdd = [];
  if(seqName == '') {
    alert("시퀀스 이름을 입력해주세요.");
    return;
  }
  if(npNumToAdd < 2) {
    alert("시퀀스를 구성하기 위한 최소의 이웃공간은 2개입니다.");
    return;
  }
  for(var i = 0; i < npNumToAdd; i++) {
      npListToAdd[i] = JSON.parse($("#addedNPfix"+i).val());
  }

  $.ajax({
      url: '/api/sequence/update',
      type: 'post',
      data: {
        seq_id : seq_id,
        np_list_add: JSON.stringify(npListToAdd),
        seq_name: seqName
      },
      success: function(data) {
        if (parseInt(data) == 0) {
          alert('성공적으로 수정되었습니다.');
          location.reload();
        } else {
          alert('수정에 실패하였습니다.');
        }
      }
    });
}

function fixSequence(seq_id, npID_set) {
  $("#seqId").val(seq_id);
  $('#existNPList').html("");
  var npID = [];
  var existNPList = [];
  var addableNPList = [];
  var seqName;

  npID = npID_set.split(",");
  npList = JSON.parse($("#data-npList").val());
  seqList = JSON.parse($("#data-seqList").val());
  for(var i = 0; i < seqList.length; i++) {
    if(seqList[i].n_SEQ_ID == seq_id) seqName = seqList[i].v_SEQ_NAME;
  }
  $('#seqName_fix').val(seqName);

  let existNPHtml = "";
  var existNPNum = 0;
  var addableNPNum = 0;
  $("#existNPListNum").val(npID.length);
  for(var i = 0; i < npID.length; i++) {
    for(var j = 0; j < npList.length; j++){
      if(npID[i] == npList[j].n_NEIGHBOR_ID) {
         existNPHtml += getAddedNPListHTML(npList[j], existNPNum, 'fix');
         if(i==0 || i==(npID.length-1)) {
          existNPHtml += "<td><button class='delete is-small' onclick='deleteNeighborSpace("+npList[j].n_NEIGHBOR_ID+")'></button></td></tr>";
         } else {
          existNPHtml += "<td></td></tr>"
      }
         existNPList[existNPNum++] = npList[j];
      }
    }
  }

  $('#existNPList').html(existNPHtml);

  let addableNPHtml = "";
  var temp = 0;
  var point1, point2;
  if((existNPList[0].tp1_id == existNPList[1].tp1_id)||(existNPList[0].tp1_id==existNPList[1].tp2_id)) point1 = existNPList[0].tp2_id;
  else point1 = existNPList[0].tp1_id;
  if((existNPList[existNPNum-1].tp1_id==existNPList[existNPNum-2].tp1_id)||(existNPList[existNPNum-1].tp1_id==existNPList[existNPNum-2].tp2_id)) point2 = existNPList[existNPNum-1].tp2_id;
  else point2 = existNPList[existNPNum-1].tp1_id;

  for(var i = 0; i < npList.length; i++) {
      if((point1==npList[i].tp1_id) || (point1==npList[i].tp2_id) || (point2==npList[i].tp1_id) || (point2==npList[i].tp2_id)) {
        for(var j = 0; j < existNPList.length; j++) {
          if(existNPList[j].n_NEIGHBOR_ID == npList[i].n_NEIGHBOR_ID ) temp = 1;
        }
        if(temp==0) addableNPList[addableNPNum++] = npList[i];
      }
      temp = 0;
  }
  for(var i = 0; i < addableNPNum; i++) {
    addableNPHtml += getAddableNPListHTML(addableNPList[i]);
  }
  if(addableNPHtml == "") {
    addableNPHtml = "<option>더 이상 추가할 수 있는 이웃 공간이 없습니다.</option>";
  }
  $('#addableNPList_fix').html(addableNPHtml);
}

function deleteNP(np_id) {
  var confirmValue = confirm('해당 이웃공간을 삭제하시겠습니까?');

  if (confirmValue) {
    $.ajax({
      type: 'post',
      url: '/api/neighbor/delete',
      data: {
        np_id: np_id
      },
      async: true,
      success: function(data) {
        if (parseInt(data.trim()) > 0) {
          alert('성공적으로 삭제되었습니다.');
          location.reload();
        } else {
          alert('삭제에 실패하였습니다.');
        }
      }
    });
  }
}


function loadStatisticsInfo(name) {
  $.ajax({
    type: 'post',
    url: '/api/file/log/statistics',
    data: {
      file_name : name
    },
    async: false,
    success: function (data) {
      var data_obj = JSON.parse(data);

      $('#statisticsTable').html(getStatisticsList(data_obj));

      var objectNumLine = {
        label: "객체수",
        backgroundColor: "Black",
        borderColor: "Black",
        data: [],
        fill: false,
      };

      Object.keys(data_obj.records).forEach(function (obj_key) {
        objectNumLine.data.push({x: parseInt(obj_key), y: data_obj.records[obj_key].include_objects.length});
      });

      $('#chartBox').html('');

      if (data_obj.record_total_length != 0) {
        $('#chartBox').html('<h3>◎ 객체수 추이</h3><div style="width:100%; height: 200px; margin-bottom: 30px;"><canvas id="objectTotalChart"></canvas></div><br>');
        showLineChart('objectTotalChart', [objectNumLine], data_obj.record_total_length);

        for (var i = 0; i < data_obj.record_object.length; i++) {
          var cur_data = {
            label: "객체수",
            backgroundColor: "Black",
            borderColor: "Black",
            data: [],
            fill: false,
          };

          Object.keys(data_obj.records).forEach(function (obj_key) {
            if (data_obj.records[obj_key].objects[data_obj.record_object[i]] == undefined) {
              cur_data.data.push({x: parseInt(obj_key), y: 0});
            } else {
              cur_data.data.push({x: parseInt(obj_key), y: data_obj.records[obj_key].objects[data_obj.record_object[i]].length});
            }
          });

          $('#chartBox').append('<h3>◎ 객체[' + data_obj.record_object[i].toString() + ']수 추이</h3><div style="width:100%; height: 200px; margin-bottom: 30px;"><canvas id="chart' + data_obj.record_object[i].toString() + '"></canvas></div><br>');
          showLineChart('chart' + data_obj.record_object[i], [cur_data], data_obj.record_total_length);
        }
      }

    }
  });
}

/*
 * REQ Functions END
 */


/*
 * Template Functions START
 */

function getStatisticsList(statistics_info) {
  var ret_str = "";

  ret_str += '<tr>';
  ret_str += '<td>' + statistics_info.record_num.toString() + '</td>';
  ret_str += '<td>' + statistics_info.record_length.toString() + '</td>';
  ret_str += '<td>' + statistics_info.record_object_num.toString() + '</td>';
  ret_str += '<td>(' + statistics_info.record_avgs.objectLocationX.toFixed(1).toString() + ', ' + statistics_info.record_avgs.objectLocationY.toFixed(1).toString() + ')</td>';
  ret_str += '<td>(' + statistics_info.record_avgs.objectSpeedX.toFixed(1).toString() + ', ' + statistics_info.record_avgs.objectSpeedY.toFixed(1).toString() + ')</td>';
  ret_str += '<td>(' + statistics_info.record_avgs.objectScaleX.toFixed(1).toString() + ', ' + statistics_info.record_avgs.objectScaleY.toFixed(1).toString() + ')</td>';
  ret_str += '<td>(' + statistics_info.record_avgs.objectColorR.toFixed(1).toString() + ', ' + statistics_info.record_avgs.objectColorG.toFixed(1).toString() + ', ' + statistics_info.record_avgs.objectColorB.toFixed(1).toString() + ')</td>';
  ret_str += '</tr>';
  return ret_str;
}

function getUserListHTML(user_info) {
  var ret_str = "";
  ret_str += "<tr>";
  ret_str += "  <td>" + user_info.v_LOGIN_ID + "</td>";
  ret_str += "  <td><button class=" + '"button is-small"' + ' onclick="openChangeModal(' + user_info.n_ADMIN_ID + ', ' + "'" + user_info.v_LOGIN_ID + "'" + ')">변경</button></td>';
  ret_str += "  <td>" + user_info.v_NAME + "</td>";
  ret_str += "  <td>" + user_info.dt_CREATE_DATE.slice(0, 10) + "</td>";
  ret_str += "  <td>" + user_info.dt_RECENT_LOGIN.slice(0, 10) + "</td>";
  ret_str += "  <td><button class=" + '"button is-small"' + ' onclick="openAdmCCTVM(' + user_info.n_ADMIN_ID + ', '+"'" + user_info.cctvs + "')" + '">관리</button></td>';
  ret_str += "  <td><button class=" + '"button is-small"' + ' onclick="deleteUser(' + user_info.n_ADMIN_ID + ',' + "'" + user_info.v_SALT + "'" + ')">삭제</button></td>';
  ret_str += "</tr>";

  return ret_str;
}

function getCCTVListHTML(cctv_info) {
  var ret_str = "";
  ret_str += "<tr>";
  ret_str += "  <td>" + cctv_info.v_MODEL + "</td>";
  ret_str += "  <td>" + cctv_info.dt_INSTALL_DATE.slice(0, 10) + "</td>";
  ret_str += "  <td>" + cctv_info.admins + "</td>";
  ret_str += "  <td><button class=" + '"button is-small" onclick="deleteCCTV(' + cctv_info.n_CCTV_ID + '">삭제</button></td>';
  ret_str += "</tr>";

  return ret_str;
}
function getTPListHTML(tp_info,cctv_info) {
  var ret_str = "";
  ret_str += "<tr>";
  ret_str += " <td name="+'"address">'+tp_info.v_ADDRESS+"</td>";
  ret_str += " <td name="+'"building">'+tp_info.v_BUILDING+"</td>";
  ret_str += " <td name="+'"floor">'+tp_info.v_FLOOR+"</td>";
  ret_str += " <td name="+'"site">'+tp_info.v_SITE+"</td>";
  ret_str += " <td><a onclick=" + ' "appendTP('+tp_info.n_TAKE_SPACE_ID+','+cctv_info.n_CCTV_ID+')">추가</a></td>';
  ret_str += "</tr>";

  return ret_str;
}

function searchTPListFromServer() {
  var tp_cond = {
    building: $('input[name="building"]').val(),
    address: $('input[name="address"]').val(),
    floor: $('input[name="floor"]').val(),
    site: $('input[name="site"]').val()
  };

  $.ajax({
    type: 'post',
    url: '/api/takeSpace/searchTPList',
    data: tp_cond,
    success: function(data) {
      $('#dataTable').html('');

      data.forEach(function(ele) {
        $('#dataTable').append(getTPListFromServerHTML(ele));
      });
    }
  });
}

function searchSEQ() {
  var seq_cond = {
    seq_name: $('#nameCond').val(),
    seq_nps: $('#nbSelectVal').val()
  };

  $.ajax({
    type: 'post',
    url: '/api/sequence/search',
    data: seq_cond,
    success: function(data) {
      $('#dataTable').html('');

      data.forEach(function(ele) {
        $('#dataTable').append(getSEQListHTML(ele));
      });
    }
  });
}

function getSEQListHTML(seq_info) {
  var ret_str = "";

  ret_str += '<tr class="hover-pointer" onclick="drawSEQOnMap(' + seq_info.n_SEQ_ID.toString() + ', this)">';
  ret_str += '  <td>' + seq_info.v_SEQ_NAME + '</td>';
  ret_str += '  <td>' + seq_info.NP_NAMES + '</td>';
  ret_str += '  <td><button class="button is-small" onclick="openModalBoxWithMapType(' + "'sequence-edit'" + '); initFixModal(' + seq_info.n_SEQ_ID.toString() + ',' + "'" + seq_info.NP_IDS + "'" + ')" >수정</button></td>';
  ret_str += '  <td><button class="button is-small" onclick="deleteSequence(' + seq_info.n_SEQ_ID.toString() + ')">삭제</button></td>';
  ret_str += '</tr>';

  return ret_str;
}

function searchPath() {
  var path_cond = {
    nameCond : $('input[name="pName"]').val(),
    locationCond : $('input[name="pLocation"]').val()
  };

  $.ajax({
    type: 'post',
    url: '/api/path/search',
    data: path_cond,
    success: function(data) {
      $('#dataTable').html('');

      data.forEach(function(ele) {
        $('#dataTable').append(getPathList(ele));
      });
    }
  });
}

function searchNP() {
  var np_cond = {
    np_tp1: $('#tp1SelectVal').val(),
    np_tp2: $('#tp2SelectVal').val(),
    np_name: $('#npNameVal').val(),
    np_path: $('#pathSelectVal').val()
  };

  $.ajax({
    type: 'post',
    url: '/api/neighbor/search',
    data: np_cond,
    success: function(data) {
      $('#dataTable').html('');
      data.forEach(function(ele) {
        $('#dataTable').append(getNPListFromServer(ele));
      });
    }
  });
}

function getAddedNPListHTML(np_info, i, mode) {

  let ret_str = "";
  ret_str += "<tr class='is-size-7'>";

  if(mode=='fix') {
    ret_str += "<input id = 'addedNPfix"+ i +"' value ='"+ JSON.stringify(np_info) +"' type = 'hidden'></input>";
  } else {
    ret_str += "<input id = 'addedNP"+ i +"' value ='"+ JSON.stringify(np_info) +"' type = 'hidden'></input>";
  }

  ret_str += "<td>"+np_info.v_NEIGHBOR_NAME+"</td>";
  ret_str += "<td>"+np_info.tp1_building+" "+np_info.tp1_floor+" "+np_info.tp1_site;
  ret_str += " ~ ";
  ret_str += np_info.tp2_building+" "+np_info.tp2_floor+" "+np_info.tp2_site+"</td>";

  if (mode =='last') {
    ret_str += '<td><button class="delete" onclick="deleteAddedSEQList(' + "'" + np_info.n_NEIGHBOR_ID.toString() + "'" + ')"></button></td>';
  } else {
    ret_str += '<td></td>';
  }

  return ret_str;
}
function getAddableNPListHTML(np_info) {
  var ret_str = "";
  ret_str += "<option value = '"+ JSON.stringify(np_info) +"'>";
  ret_str += np_info.v_NEIGHBOR_NAME+": ";
  ret_str += np_info.tp1_building+" "+np_info.tp1_floor+" "+np_info.tp1_site;
  ret_str += " ~ ";
  ret_str += np_info.tp2_building+" "+np_info.tp2_floor+" "+np_info.tp2_site;
  ret_str += "</option>"
  return ret_str;
}

function getMFListHTML(mf_info) {
  var ret_str = "";

  ret_str += '<tr>';
  ret_str += '  <td rowspan="2" width="45%">' + mf_info.v_MOVIE_FILE_NAME + '</td>';
  ret_str += '  <td width="10%">' + mf_info.dt_START_TIME.slice(0,10) + '</td>';
  ret_str += '  <td width="10%">' + mf_info.dt_END_TIME.slice(0,10) + '</td>';
  ret_str += '  <td rowspan="2" width="15%">' + mf_info.v_ADDRESS + ' ' + mf_info.v_BUILDING + ' ' + mf_info.v_FLOOR + ' ' + mf_info.v_SITE + '</td>';
  ret_str += '  <td rowspan="2" width="15%">' + mf_info.SEQS + '</td>';
  ret_str += '  <td width="5%"><a class="button is-small is-size-7" href="/upload/' + mf_info.v_ADDRESS.split(' ').join('') + mf_info.v_BUILDING.split(' ').join('') + mf_info.v_FLOOR.split(' ').join('') + mf_info.v_SITE.split(' ').join('') + '/' + mf_info.v_MOVIE_FILE_NAME + '">다운로드</a></td>';
  ret_str += '</tr>';
  ret_str += '<tr>';
  ret_str += '  <td>' + mf_info.v_EXTENSION + '</td>';
  ret_str += '  <td>' + mf_info.v_MODEL + '</td>';
  ret_str += '  <td><button class="button is-small is-size-7" onclick="deleteMF(' + "'" + mf_info.v_MOVIE_FILE_NAME + "'" + ')">삭제</button></td>';
  ret_str += '</tr>';

  return ret_str;
}


function getLFListHTML(lf_info) {
  var ret_str = "";

  ret_str += '<tr>';
  ret_str += '  <td rowspan="2" width="25%">' + lf_info.v_MOVIE_FILE_NAME + '</td>';
  ret_str += '  <td rowspan="2" width="25%">' + lf_info.v_LOG_FILE_NAME + '</td>';
  ret_str += '  <td width="10%">' + lf_info.dt_START_TIME.slice(0,10) + '</td>';
  ret_str += '  <td width="10%">' + lf_info.dt_END_TIME.slice(0,10) + '</td>';
  ret_str += '  <td width="25%">' + lf_info.v_ADDRESS + ' ' + lf_info.v_BUILDING + ' ' + lf_info.v_FLOOR + ' ' + lf_info.v_SITE + '</td>';
  ret_str += '  <td width="5%"><a class="button is-small" href="/upload/' + lf_info.v_ADDRESS.split(' ').join('') + lf_info.v_BUILDING.split(' ').join('') + lf_info.v_FLOOR.split(' ').join('') + lf_info.v_SITE.split(' ').join('') + '/' + lf_info.v_LOG_FILE_NAME + '">다운로드</a></td>';
  ret_str += '  <td rowspan="2" width="5%"><button class="button is-small">통계보기</button></td>';
  ret_str += '</tr>';
  ret_str += '<tr>';
  ret_str += '  <td>' + lf_info.v_EXTENSION + '</td>';
  ret_str += '  <td>' + lf_info.v_MODEL + '</td>';
  ret_str += '  <td>' + lf_info.SEQS + '</td>';
  ret_str += '  <td><button class="button is-small is-size-7" onclick="deleteLF(' + "'" + lf_info.v_LOG_FILE_NAME + "'" + ')">삭제</button></td>';
  ret_str += '</tr>';

  return ret_str;
}


function getTPListFromServerHTML(tp_info) {
  var ret_str = '';
  ret_str += '<tr class="hover-pointer" onclick="markerCenter(' + "'tpMap'," + tp_info.f_LAT.toString() + ',' + tp_info.f_LNG.toString() + ", 'take_space'," + 'this)">';
  ret_str += '  <td name="address">' + tp_info.v_ADDRESS + '</td>';
  ret_str += '  <td name="building">' + tp_info.v_BUILDING + '</td>';
  ret_str += '  <td name="floor">' + tp_info.v_FLOOR + '</td>';
  ret_str += '  <td name="site">' + tp_info.v_SITE + '</td>';
  ret_str += '  <td onclick="delTP(' + tp_info.n_TAKE_SPACE_ID.toString() + ')"><a>삭제</a></td>';
  ret_str += '</tr>';

  return ret_str;
}

function getPathList(path_info) {
  var ret_str = '';

  ret_str += '<tr class="hover-pointer" onclick="drawPathOnMap(' + "'pathMap'" + ', ' + path_info.f_LAT_START + ', ' + path_info.f_LNG_START + ', ' + path_info.f_LAT_END + ', ' + path_info.f_LNG_END + ', ' + "'path'" + ', this)">';
  ret_str += '  <td name="pathName">' + path_info.v_PATH_NAME + '</td>';
  ret_str += '  <td name="pathLocation">' + path_info.v_LOCATION +'</td>';
  ret_str += '  <td onclick="deletePath(' + path_info.n_PATH_ID.toString() + ')"><a>삭제</a></td>';
  ret_str += '</tr>';

  return ret_str;
}

function getNPListFromServer(np_info) {
  var ret_str = '';

  ret_str += '<tr name="row' + np_info.n_NEIGHBOR_ID.toString() + '" class="hover-pointer" onclick="drawNPOnMap(' + np_info.n_NEIGHBOR_ID.toString() + ', ' + np_info.tp1_lat.toString() + ', ' + np_info.tp1_lng.toString() + ', ' + np_info.tp2_lat.toString() + ', ' + np_info.tp2_lng.toString() + ', ' + np_info.ps_lat.toString() + ', ' + np_info.ps_lng.toString() + ', ' + np_info.pe_lat.toString() + ', ' + np_info.pe_lng.toString() + ')">';
  ret_str += '  <td rowspan="2">' + np_info.v_NEIGHBOR_NAME + '</td>';
  ret_str += '  <td>' + np_info.tp1_address + ' ' + np_info.tp1_building + ' ' + np_info.tp1_floor + ' ' + np_info.tp1_site + '</td>';
  ret_str += '  <td rowspan="2">' + np_info.path_name + '</td>';
  ret_str += '  <td rowspan="2"><button class="button is-small" onclick="deleteNP(' + np_info.n_NEIGHBOR_ID.toString() + ')">삭제</button></td>';
  ret_str += '</tr>';
  ret_str += '<tr name="row' + np_info.n_NEIGHBOR_ID.toString() + '" class="hover-pointer" onclick="drawNPOnMap(' + np_info.n_NEIGHBOR_ID.toString() + ', ' + np_info.tp1_lat.toString() + ', ' + np_info.tp1_lng.toString() + ', ' + np_info.tp2_lat.toString() + ', ' + np_info.tp2_lng.toString() + ', ' + np_info.ps_lat.toString() + ', ' + np_info.ps_lng.toString() + ', ' + np_info.pe_lat.toString() + ', ' + np_info.pe_lng.toString() + ')">';
  ret_str += '  <td>' + np_info.tp2_address + ' ' + np_info.tp2_building + ' ' + np_info.tp2_floor + ' ' + np_info.tp2_site + '</td>';
  ret_str += '</tr>';

  return ret_str;
}
/*
 * Template Functions END
 */


/*
 * Map Functions START
 */

// Map Variables
var icons = {
  cctv: '/images/cctv_icon.png',
  take_space:'/images/take_space_icon.png',
  path: '/images/path_icon.png'
};

function initMap() {
  if ($('#targetCctvInput').val() == undefined) return;

  var targetCctv = JSON.parse($('#targetCctvInput').val());
  var tpListElements = $('.tp-list-tr').toArray();
  var tpCoords = tpListElements.map(function (el) {
    return {
      'lat': parseFloat(el.getAttribute('data-lat')),
      'lng': parseFloat(el.getAttribute('data-lng'))
    };
  });

    var cctv_coords = {
      'lat' : targetCctv[0].f_LAT,
      'lng' : targetCctv[0].f_LNG
    };

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: cctv_coords,
      mapTypeId: 'roadmap',
      scrollwheel: false
    });

    var cctv_marker = new google.maps.Marker({
      position: cctv_coords,
      map: map,
      title: "CCTV",
      icon: icons.cctv
    });

    var tp_markers = tpCoords.map(function(location) {
          return new google.maps.Marker({
            position: location,
            icon: icons.take_space,
            title:"촬영공간"
          });
    });

    var markerCluster = new MarkerClusterer(map, tp_markers,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

}

function initAddCCTVMap() {
  var map = new google.maps.Map(document.getElementById('cctvAddMap'), {
    zoom: 17,
    center: {
      lat: 37.561816,
      lng: 126.936277
    },
    mapTypeId: 'roadmap',
    scrollwheel: false
  });

  var nMarker = null;
  var nRadius = null;

  map.addListener('click', function(event) {
    var latitude = event.latLng.lat();
    var longitude = event.latLng.lng();

    if (nMarker != null) nMarker.setMap(null);

    nMarker = new google.maps.Marker({
      position: {
        lat: latitude,
        lng: longitude
      },
      map: map,
      title: "새 CCTV",
      icon: icons.cctv
    });

    $('input[name="cctvLng"]').val(longitude);
    $('input[name="cctvLat"]').val(latitude);

    if (nRadius != null) nRadius.setMap(null);

    nRadius = new google.maps.Circle({map: map,
        radius: 50,
        center: event.latLng,
        fillColor: '#777',
        fillOpacity: 0.1,
        strokeColor: '#000000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        draggable: false,    // Dragable
        editable: false      // Resizable
    });
  });
}

function initPathMap() {
  var map = new google.maps.Map(document.getElementById('pathMap'), {
    zoom: 17,
    center: {
      lat: 37.561816,
      lng: 126.936277
    },
    mapTypeId: 'roadmap',
    scrollwheel: false
  });

  initPathAddMap();
}

function initNPMap() {
  var map = new google.maps.Map(document.getElementById('npMap'), {
    zoom: 17,
    center: {
      lat: 37.561816,
      lng: 126.936277
    },
    mapTypeId: 'roadmap',
    scrollwheel: false
  });

  initNPAddMap();
}

function initNPAddMap() {
  var map = new google.maps.Map(document.getElementById('npAddMap'), {
    zoom: 17,
    center: {
      lat: 37.561816,
      lng: 126.936277
    },
    mapTypeId: 'roadmap',
    scrollwheel: false
  });


  if ($('input[name="npSelectTP1"]').val() != '') {
    var tp1 = JSON.parse($('input[name="npSelectTP1"]').val());

    var nMarker = new google.maps.Marker({
      position: {
        lat: tp1.latitude,
        lng: tp1.longitude
      },
      map: map,
      title: '촬영공간1',
      icon: icons['take-space']
    });

    var nRadius = new google.maps.Circle({map: map,
        radius: 50,
        center: {
          lat: tp1.latitude,
          lng: tp1.longitude
        },
        fillColor: '#777',
        fillOpacity: 0.1,
        strokeColor: '#000000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        draggable: false,    // Dragable
        editable: false      // Resizable
    });
  }

  if ($('input[name="npSelectTP2"]').val() != '') {
    var tp2 = JSON.parse($('input[name="npSelectTP2"]').val());

    var nMarker = new google.maps.Marker({
      position: {
        lat: tp2.latitude,
        lng: tp2.longitude
      },
      map: map,
      title: '촬영공간2',
      icon: icons['take-space']
    });

    var nRadius = new google.maps.Circle({map: map,
        radius: 50,
        center: {
          lat: tp2.latitude,
          lng: tp2.longitude
        },
        fillColor: '#777',
        fillOpacity: 0.1,
        strokeColor: '#000000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        draggable: false,    // Dragable
        editable: false      // Resizable
    });
  }

  if ($('input[name="npSelectPath"]').val() != '') {
    var path = JSON.parse($('input[name="npSelectPath"]').val());

    var polyline = new google.maps.Polyline({
      path: [
        {lat: path[0].latitude, lng: path[0].longitude},
        {lat: path[1].latitude, lng: path[1].longitude}
      ],
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      map: map
    });
  }
}

function initTPMap() {
  var map = new google.maps.Map(document.getElementById('tpMap'), {
    zoom: 17,
    center: {
      lat: 37.561816,
      lng: 126.936277
    },
    mapTypeId: 'roadmap',
    scrollwheel: false
  });

  initTPAddMap();
}

function markerCenter(id, lat, lng, type, ele) {

  $(ele).parent().children().each(function() {
    $(this).removeClass('tr-selected');
  });

  $(ele).addClass('tr-selected');

  var map = new google.maps.Map(document.getElementById(id), {
    zoom: 17,
    center: {
      lat: lat,
      lng: lng
    },
    mapTypeId: 'roadmap',
    scrollwheel: false
  });

  var nMarker = new google.maps.Marker({
    position: {
      lat: lat,
      lng: lng
    },
    map: map,
    title: '선택된 ' + type,
    icon: icons[type]
  });

  var nRadius = new google.maps.Circle({map: map,
      radius: 50,
      center: {
        lat: lat,
        lng: lng
      },
      fillColor: '#777',
      fillOpacity: 0.1,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      draggable: false,    // Dragable
      editable: false      // Resizable
  });
}

function drawNPOnMap(id, tp1_lat, tp1_lng, tp2_lat, tp2_lng, ps_lat, ps_lng, pe_lat, pe_lng) {
  $('tr').each(function() {
    $(this).removeClass('tr-selected');
  });

  $('tr[name="row' + id.toString() + '"]').each(function() {
    $(this).addClass('tr-selected');
  })

  var map = new google.maps.Map(document.getElementById('npMap'), {
    zoom: 17,
    center: {
      lat: (ps_lat + pe_lat)/2,
      lng: (ps_lng + pe_lng)/2
    },
    mapTypeId: 'roadmap',
    scrollwheel: false
  });

  var sMarker = new google.maps.Marker({
    position: {
      lat: tp1_lat,
      lng: tp1_lng
    },
    map: map,
    title: '촬영공간1',
    icon: icons['take_space']
  });

  var eMarker = new google.maps.Marker({
    position: {
      lat: tp2_lat,
      lng: tp2_lng
    },
    map: map,
    title: '촬영공간2',
    icon: icons['take_space']
  });

  var nRadius = new google.maps.Circle({map: map,
      radius: 50,
      center: {
        lat: tp1_lat,
        lng: tp1_lng
      },
      fillColor: '#777',
      fillOpacity: 0.1,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      draggable: false,    // Dragable
      editable: false      // Resizable
  });

  nRadius = new google.maps.Circle({map: map,
      radius: 50,
      center: {
        lat: tp2_lat,
        lng: tp2_lng
      },
      fillColor: '#777',
      fillOpacity: 0.1,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      draggable: false,    // Dragable
      editable: false      // Resizable
  });

  var polyline = new google.maps.Polyline({
    path: [
      {lat: ps_lat, lng: ps_lng},
      {lat: pe_lat, lng: pe_lng}
    ],
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  polyline.setMap(map);
}

function drawPathOnMap(id, s_lat, s_lng, e_lat, e_lng, type, ele) {
  $(ele).parent().children().each(function() {
    $(this).removeClass('tr-selected');
  });

  $(ele).addClass('tr-selected');

  var map = new google.maps.Map(document.getElementById(id), {
    zoom: 17,
    center: {
      lat: (s_lat + e_lat)/2,
      lng: (s_lng + e_lng)/2
    },
    mapTypeId: 'roadmap',
    scrollwheel: false
  });

  var sMarker = new google.maps.Marker({
    position: {
      lat: s_lat,
      lng: s_lng
    },
    map: map,
    title: '경로 위치1',
    icon: icons[type]
  });

  var eMarker = new google.maps.Marker({
    position: {
      lat: e_lat,
      lng: e_lng
    },
    map: map,
    title: '경로 위치2',
    icon: icons[type]
  });

  var polyline = new google.maps.Polyline({
    path: [
      {lat: s_lat, lng: s_lng},
      {lat: e_lat, lng: e_lng}
    ],
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  polyline.setMap(map);
}

function initTPAddMap() {
  var map = new google.maps.Map(document.getElementById('tpAddMap'), {
    zoom: 17,
    center: {
      lat: 37.561816,
      lng: 126.936277
    },
    mapTypeId: 'roadmap',
    scrollwheel: false
  });

  var nMarker = null;
  var nRadius = null;

  map.addListener('click', function(event) {
    var latitude = event.latLng.lat();
    var longitude = event.latLng.lng();

    if (nMarker != null) nMarker.setMap(null);

    nMarker = new google.maps.Marker({
      position: {
        lat: latitude,
        lng: longitude
      },
      map: map,
      title: "새 CCTV",
      icon: icons.take_space
    });

    $('input[name="tpLng"]').val(longitude);
    $('input[name="tpLat"]').val(latitude);

    if (nRadius != null) nRadius.setMap(null);

    nRadius = new google.maps.Circle({map: map,
        radius: 50,
        center: event.latLng,
        fillColor: '#777',
        fillOpacity: 0.1,
        strokeColor: '#000000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        draggable: false,    // Dragable
        editable: false      // Resizable
    });

    getLocation(latitude, longitude);
  });
}


function initPathAddMap() {
  var map = new google.maps.Map(document.getElementById('pathAddMap'), {
    zoom: 17,
    center: {
      lat: 37.561816,
      lng: 126.936277
    },
    mapTypeId: 'roadmap',
    scrollwheel: false
  });

  var nMarker = [];
  var nRadius = null;
  var polyline = null;

  map.addListener('click', function(event) {
    var latitude = event.latLng.lat();
    var longitude = event.latLng.lng();

    if (nMarker.length == 2) {
      nMarker[0].setMap(null);
      nMarker.splice(0, 1);

      $('input[name="pathLngStart"]').val(nMarker[0].position.lng());
      $('input[name="pathLatStart"]').val(nMarker[0].position.lat());

      $('input[name="pathLngEnd"]').val(longitude);
      $('input[name="pathLatEnd"]').val(latitude);

    } else if (nMarker.length == 1) {
      $('input[name="pathLngEnd"]').val(longitude);
      $('input[name="pathLatEnd"]').val(latitude);
    } else {
      $('input[name="pathLngStart"]').val(longitude);
      $('input[name="pathLatStart"]').val(latitude);
    }

    var new_Marker = new google.maps.Marker({
      position: {
        lat: latitude,
        lng: longitude
      },
      map: map,
      title: "새 경로",
      icon: icons.take_space
    });

    nMarker.push(new_Marker);



    if (nMarker.length == 2) {
      if (polyline != null) polyline.setMap(null);

      polyline = new google.maps.Polyline({
        path: [
          {lat: nMarker[0].position.lat(), lng: nMarker[0].position.lng()},
          {lat: nMarker[1].position.lat(), lng: nMarker[1].position.lng()}
        ],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      polyline.setMap(map);
    }
  });
}

function getLocation(lat, lng) {
  //https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyDmBwHX4GyyS7PxSu4jBwTLM2uelcCVdb8

  $.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat.toString() + "," + lng.toString() + "&key=AIzaSyDmBwHX4GyyS7PxSu4jBwTLM2uelcCVdb8",
    type: "get",
    async: false,
    success : function(data) {
      var target_address = data.results[0];
      var establishment = false;

      for (var i = 0; i < target_address.address_components[0].types.length; i++) {
        if (target_address.address_components[0].types[i] == "establishment") {
          establishment = true;
          break;
        }
      }

      if (establishment) {
        $('input[name="tpAddress"]').val(target_address.formatted_address.replace(target_address.address_components[0].long_name, ''));
        $('input[name="tpBuilding"]').val(target_address.address_components[0].long_name);
      } else {
        $('input[name="tpAddress"]').val(target_address.formatted_address);
        $('input[name="tpBuilding"]').val('');
      }
    }
  });
}

function initSEQMap() {
  var map = new google.maps.Map(document.getElementById('seqMap'), {
    zoom: 17,
    center: {
      lat: 37.561816,
      lng: 126.936277
    },
    mapTypeId: 'roadmap',
    scrollwheel: false
  });
}

function initSEQAddMap() {
  var map = new google.maps.Map(document.getElementById('seqAddMap'), {
    zoom: 17,
    center: {
      lat: 37.561816,
      lng: 126.936277
    },
    mapTypeId: 'roadmap',
    scrollwheel: false
  });

  var added_np_list = $('input[name="addedNPs"]').val().split(',');
  var added_np_list_num = added_np_list.length;
  if ($('input[name="addedNPs"]').val() == '') {
    added_np_list_num = 0;
  }

  var tp_obj = {};
  var path_obj = {};

  for (var i = 0; i < added_np_list_num; i++) {
    var cur_np_info = JSON.parse($('#addedNP' + i.toString()).val());

    tp_obj[cur_np_info.n_SPACE_1] = {
      lat: cur_np_info.tp1_lat,
      lng: cur_np_info.tp1_lng
    };

    tp_obj[cur_np_info.n_SPACE_2] = {
      lat: cur_np_info.tp2_lat,
      lng: cur_np_info.tp2_lng
    };

    path_obj[cur_np_info.n_PATH_ID] = {
      s_lat: cur_np_info.f_LAT_START,
      s_lng: cur_np_info.f_LNG_START,
      e_lat: cur_np_info.f_LAT_END,
      e_lng: cur_np_info.f_LNG_END
    };
  }

  var tp_obj_keys = Object.keys(tp_obj);
  var path_obj_keys = Object.keys(path_obj);

  for (var i = 0; i < tp_obj_keys.length; i++) {
    var key = tp_obj_keys[i];
    var nMarker = new google.maps.Marker({
      position: {
        lat: tp_obj[key].lat,
        lng: tp_obj[key].lng
      },
      map: map,
      title: "촬영공간",
      icon: icons.take_space
    });

    var nRadius = new google.maps.Circle({map: map,
        radius: 50,
        center: {
          lat: tp_obj[key].lat,
          lng: tp_obj[key].lng
        },
        fillColor: '#777',
        fillOpacity: 0.1,
        strokeColor: '#000000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        draggable: false,    // Dragable
        editable: false      // Resizable
    });
  }

  for (var i = 0; i < path_obj_keys.length; i++) {
    var key = path_obj_keys[i];
    var polyline = new google.maps.Polyline({
      path: [
        {lat: path_obj[key].s_lat, lng: path_obj[key].s_lng},
        {lat: path_obj[key].e_lat, lng: path_obj[key].e_lng}
      ],
      map: map,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
  }
}

function drawSEQOnMap(id, element) {
  $('.hover-pointer').each(function() {
    $(this).removeClass('tr-selected');
  });

  $(element).addClass('tr-selected');

  var tp1_obj = JSON.parse($('input[name="seqTP1' + id.toString() + '"]').val());
  var tp2_obj = JSON.parse($('input[name="seqTP2' + id.toString() + '"]').val());
  var path_obj = JSON.parse($('input[name="seqPATH' + id.toString() + '"]').val());

  var tp_list = {};

  Object.keys(tp1_obj).forEach(function (key) {
    tp_list[key] = tp1_obj[key];
  });

  Object.keys(tp2_obj).forEach(function (key) {
    tp_list[key] = tp2_obj[key];
  });

  var map = new google.maps.Map(document.getElementById('seqMap'), {
    zoom: 17,
    center: {
      lat: 37.561816,
      lng: 126.936277
    },
    mapTypeId: 'roadmap',
    scrollwheel: false
  });


  var tp_list_keys = Object.keys(tp_list);
  var path_list_keys = Object.keys(path_obj);

  for (var i = 0; i < tp_list_keys.length; i++) {
    var key = tp_list_keys[i];
    var nMarker = new google.maps.Marker({
      position: {
        lat: tp_list[key].lat,
        lng: tp_list[key].lng
      },
      map: map,
      title: "촬영공간",
      icon: icons.take_space
    });

    var nRadius = new google.maps.Circle({map: map,
        radius: 50,
        center: {
          lat: tp_list[key].lat,
          lng: tp_list[key].lng
        },
        fillColor: '#777',
        fillOpacity: 0.1,
        strokeColor: '#000000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        draggable: false,    // Dragable
        editable: false      // Resizable
    });
  }

  for (var i = 0; i < path_list_keys.length; i++) {
    var key = path_list_keys[i];
    var polyline = new google.maps.Polyline({
      path: [
        {lat: path_obj[key].s_lat, lng: path_obj[key].s_lng},
        {lat: path_obj[key].e_lat, lng: path_obj[key].e_lng}
      ],
      map: map,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
  }
}
 /*
 * Map Functions END
 */
