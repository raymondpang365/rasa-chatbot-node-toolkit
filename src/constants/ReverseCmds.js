module.exports = {
  init_service_request_notification: (category, address, enquirer) =>
    `/委派工作 服务:${category} 单位:${address} 客户:${enquirer}`,

  init_notify_respondent_found: (service, name) =>
    `/服务要求被接受 服务:${service} 员工名称:${name}`,

  init_notify_respondent_not_found: (service) =>
    `/未找到员工接受服务要求 service:${service}`,

  init_notify_service_completed: (service, name) =>
    `/服务完成 service:${service} staffName:${name}`
}
