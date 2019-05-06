module.exports = {
  init_service_request_notification: (category, floor, flat) =>
    `/委派工作 服务:${category} 单位:${floor} 楼层:${flat}`,

  init_inform_respondent_found: (service, name) =>
    `/服务要求被接受 服务:${service} 员工名称:${name}`,

  init_inform_respondent_not_found: (service) =>
    `/未找到员工接受服务要求 service:${service}`,

  init_inform_service_completed: (service, name) =>
    `/服务完成 service:${service} staffName:${name}`
}
