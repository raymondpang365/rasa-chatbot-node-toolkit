module.exports = {
  init_offer_job: (category, floor, flat) =>
    `/委派工作 service:${category} floor:${floor} flat:${flat}`,

  init_inform_respondent_found: (service, name) =>
    `/服务要求被接受 service:${service} staffName:${name}`,

  init_inform_respondent_not_found: (service) =>
    `/未找到员工接受服务要求 service:${service}`,

  init_inform_service_completed: (service, name) =>
    `/服务完成 service:${service} staffName:${name}`
}
