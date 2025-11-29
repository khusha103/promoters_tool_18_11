import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  constructor(private http: HttpClient) { }
  // private apiUrl = `${environment.baseUrl}/erp/App_api`;
  // private apiUrl = `${environment.baseUrl}/happy_pta/App_api`;
  private apiUrl = `${environment.apiBaseUrl}/App_api`;
  // private apiUrl2 = `${environment.baseUrl}/erp/Apiv1`;

  // private happyapiUrl = `${environment.baseUrl}/happy/App_api`;


  
getCategories(categoryId: number, heading: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories/${categoryId}/${heading}`);
  }

  //get series id = prductId where heading =2(salestalk) and filetype=doc|video

getSalesTalkResults(countryId: number, categoryId: number, headingId: number, seriesId: number, language: string = 'en') {
    const url = `${this.apiUrl}/salestalk/${countryId}/${categoryId}/${headingId}/${seriesId}/${language}`;
    return this.http.get<SalesTalkResponse>(url);
}

getCounterTalkResults(countryId: number, categoryId: number, headingId: number, seriesId: number, language: string = 'en') {
  const url = `${this.apiUrl}/countertalk/${countryId}/${categoryId}/${headingId}/${seriesId}/${language}`;
  return this.http.get<CounterTalkResponse>(url);
}


// getGuidelines(countryId: number, categoryId: number, lang: string): Observable<any> {
//   //if need to send lang as paramaeter send in api 
//   return this.http.get<any>(`${this.apiUrl}/guidelines/${countryId}/${categoryId}`);
// }

getGuidelines(countryId: number, categoryId: number, lang: string): Observable<any> {
  // Include lang as a query parameter in the API request
  return this.http.get<any>(`${this.apiUrl}/guidelines/${countryId}/${categoryId}/${lang}`);
}

getServiceRelated(countryId: number, categoryId: number, lang: string): Observable<any> {
   //if need to send lang as paramaeter send in api 
  return this.http.get<any>(`${this.apiUrl}/service_related/${countryId}/${categoryId}`);
}

// Method to get surveys based on countryId, categoryId, lang, and userId
getSurveys(countryId: number, categoryId: number, lang: string, userId: number) {
  return this.http.get<any>(`${this.apiUrl}/surveys/${countryId}/${categoryId}/${lang}/${userId}`);
}

// Method to get survey options
// getSurveyOptions() {
//   return this.http.get<any>(`${this.apiUrl}/options`);
// }



  // getrolemenus(roleId: number): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/menuaccess_ptauser/${roleId}}`);
  // }

  getrolemenus(roleId: number, countryId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/menuaccess_ptauser/${roleId}/${countryId}`);
  }

  menuaccess_hpuser_get(roleId: number, countryId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/menuaccess_hpuser/${roleId}/${countryId}`);
  }

  getBanners(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/banners`);
  }

    // New: send attendance with base64 photo in the payload
  saveAttendanceWithPhoto(payload: any): Observable<any> {
    // posts to same attendance endpoint, backend should accept photo base64 in payload.photo
    return this.http.post<any>(`${this.apiUrl}/attendance`, payload, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  saveAttendance(payload: any) {
  return this.http.post(`${this.apiUrl}/attendance`, payload);
}

  // ✔ SAVE CHECK-OUT WITHOUT PHOTO (attendance page)
// saveAttendance(userId: number, actionId: number, comment: string, lat: any, lon: any): Observable<any> {
//   const body = {
//     user_id: userId,
//     action_id: actionId,
//     comment: comment,
//     loc_latitude: lat,
//     loc_longitude: lon
//   };
//   return this.http.post(`${this.apiUrl}/attendance`, body);
// }
//  saveAttendance(userId: string, actionId: number, comment: string, locLatitude: number, locLongitude: number): Observable<any> {
//     const postData = {
//       user_id: userId,
//       action_id: actionId,
//       loc_latitude: locLatitude,
//       loc_longitude: locLongitude,
//       comment: comment
//     };
//     return this.http.post(`${this.apiUrl}/attendance`, postData);
//   }
getWeeklyAttendance(userId: number, storeId: number = 0): Observable<any> {
  // If storeId is null/undefined, default to 0 to match API contract
  const sId = (storeId === null || storeId === undefined) ? 0 : storeId;
  return this.http.get(`${this.apiUrl}/get_week_attendance/${userId}/${sId}`);
}



  // Method to get all categories
  getSonyCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getcategory`);
  }

//-----------------fetch user profile data--------------------------

  // Method to fetch user data by ID
  getUserById(userId: number): Observable<any> {
    const url = `${this.apiUrl}/getUsersbyId/${userId}`; // Construct the full URL
    return this.http.get<any>(url).pipe(
      catchError(this.handleError) // Handle errors
    );
  }
  

  // Error handling method
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error); // Log the error to the console
    throw new Error('Something went wrong; please try again later.'); // Throw an error
  }

//-----------------insert+update+fetch basic data--------------------------

saveBasicDetails(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/save_basic_details`, formData);
  }

getBasicDetails(userId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/get_basic_details/${userId}`);
}


// -----------------------------------------online exam module-------------------------
// getExamDetails(categoryId: number): Observable<any> {
//   return this.http.get(`${this.apiUrl}/exams/${categoryId}`);
// }

getExamDetails(categoryId: number, countryId: number, roleId: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/exams/${categoryId}/${countryId}/${roleId}`);
}

getQuestionsByExam(examId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/exam_ques/${examId}`);
}


storeAnswer(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/store_answer`, data);
}

updateExamProgress(userId: number, examId: number, remainingTime: number) {
  // const url = '/update_exam_progress';
  const body = { userId, examId, remainingTime };

  return this.http.post(`${this.apiUrl}/update_exam_progress`, body);
}

getUserProgress(examId: number,userId: number): Observable<UserProgressResponse> {
  // const url = `${this.apiUrl}/user-progress?examId=${examId}`;
  return this.http.get<UserProgressResponse>(`${this.apiUrl}/get_progress/${examId}/${userId}`);
}


getQuestionAnswer(userId: number, testId: number): Observable<any> {
  // const url = `${this.apiUrl}/test_users_detail/${userId}/${testId}`;
  return this.http.get(`${this.apiUrl}/get_question_answer/${userId}/${testId}`);
}

calculateScore(userId: number, testId: number): Promise<any> {
  return this.http.post<any>(`${this.apiUrl}/calculate_score`, {
      user_id: userId,
      test_id: testId
  }).toPromise();
}

submitQuizAnswers(data:any): Promise<any> {
  return this.http.post<any>(`${this.apiUrl}/store_final_submit`, 
    data
  ).toPromise();
}

// Method to get exam results
getExamResults(userId: number, testId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/get_exam_results/${userId}/${testId}`);
}

// getNotifications(toId: string, toRoleId: string): Observable<any> {
//   // const body = {}; // Assuming no body is required for this request

//   // const headers = new HttpHeaders({
//   //   'Content-Type': 'application/json'
//   // });

//   // const params = new HttpParams()
//   //   .set('to_id', toId)
//   //   .set('to_role_id', toRoleId);

//     const body = { toId, toRoleId};

//   return this.http.post<any>(`${this.apiUrl}/notification_api`, body);
// }

getNotifications(to_id: number, to_role_id: number): Promise<any> {
  const body = { to_id, to_role_id};

  return this.http.post<any>(`${this.apiUrl}/notification_api`, 
    body
  ).toPromise();
}

 // Method to save the selected language
 saveLanguage(languageId: number,userId: number): Observable<any> {
  const body = { languageId, userId}; // Create request body
  const headers = new HttpHeaders({
    'Content-Type': 'application/json', // Set content type
  });

  return this.http.post(`${this.apiUrl}/set_language`, body, { headers }); // Send POST request
}

// getNotifications(toId: string, toRoleId: string): Promise<any> {
//   const body = { to_id: toId, to_role_id: toRoleId };

//   const headers = new HttpHeaders({
//     'Content-Type': 'application/json'
//   });

//   return this.http.post<any>(`${this.apiUrl}/notification_api`, body, { headers }).toPromise();
// }


// ----------------------------------------------dropdowns get api--------------------------------------------------
 // GET all outlets
 getAllOutlets(): Observable<any> {
  return this.http.get(`${this.apiUrl}/getalloutlet`);
}

// GET outlet by ID
getOutletById(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/getoutletbyid/${id}`);
}

// GET all retailers
getAllRetailers(): Observable<any> {
  return this.http.get(`${this.apiUrl}/getallretailer`);
}

// GET retailer by ID
getRetailerById(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/getretailerbyid/${id}`);
}


// Fetch retailers by country ID
getRetailersByCountry(countryId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/getretailerbycid/${countryId}`);
}

// Fetch outlets by retailer ID and country ID
getOutletsByRetailerAndCountry(retailerId: number, countryId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/getoutletbyrid/${retailerId}/${countryId}`);
}

// GET all countries
getAllCountries(): Observable<any> {
  return this.http.get(`${this.apiUrl}/getallcountry`);
}

// GET country by ID
getCountryById(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/getcountrybyid/${id}`);
}

// GET all categories
getAllCategories(): Observable<any> {
  return this.http.get(`${this.apiUrl}/getcategory`);
}

// GET category by ID
getCategoryById(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/getcategorybyid/${id}`);
}

//-----------------------------------------------customer info module-------------------------------------------------
getPreferences() {
  return this.http.get<any>(`${this.apiUrl}/getpreferences`);
}

getGenders() {
  return this.http.get<any>(`${this.apiUrl}/getgenders`);
}

getAgeBrackets() {
  return this.http.get<any>(`${this.apiUrl}/getagebrackets`);
}

getNationalities() {
  return this.http.get<any>(`${this.apiUrl}/getnationality`); 
}

getProductsByCategory(categoryId: number) {
  return this.http.get<any>(`${this.apiUrl}/products/${categoryId}`);
}

getProductsByOutletAndCategory(outletId: number, categoryId: number): Observable<any> {
  // const url = `https://your-api-endpoint/api/products_by_outlet_and_category/${outletId}/${categoryId}`;
  // return this.http.get(url);
  return this.http.get<any>(`${this.apiUrl}/products_by_outlet_and_category/${outletId}/${categoryId}`);
}

getAttachmentsProductsByCategory(categoryId: number) {
  return this.http.get<any>(`${this.apiUrl}/attachment_products/${categoryId}`);
}
getAllProducts() {
  return this.http.get<any>(`${this.apiUrl}/all_products`);
}

// getAllProducts_bycat() {
//   return this.http.get<any>(`${this.apiUrl}/all_products`);
// }


submitCustomerInfo(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/save`, data);
}


async getFields(categoryId: number): Promise<ApiResponse<Field[]>> {
  return lastValueFrom(this.http.get<ApiResponse<Field[]>>(`${this.apiUrl}/fields/${categoryId}`));
}

async getOptions(fieldId: number,catID: number): Promise<ApiResponse<Option[]>> {
  return lastValueFrom(this.http.get<ApiResponse<Option[]>>(`${this.apiUrl}/options/${fieldId}/${catID}`));
}


// ---------------------------------------------planogram and ranging feedbck module------------------------------
// Method to get planogram data by category ID
getPlanogramsByCategoryId(categoryId: number,storeId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/get_planograms_by_category/${categoryId}/${storeId}`);
}

getLatestFeedback(categoryId: number, storeId: number): Observable<{ status: boolean; data: Feedback; message: string | null }> {
  return this.http.get<{ status: boolean; data: Feedback; message: string | null }>(`${this.apiUrl}/get_latest_ranging_feedback/${categoryId}/${storeId}`);
}

// Method to submit feedback
submitFeedback(data: any): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  return this.http.post(`${this.apiUrl}/rangingupdate`, data, { headers });
}

getCategoryplanograms(categoryId: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/category_planograms/${categoryId}`);
}

submitPlanogramFeedback(feedbackData: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/planogram_feedback`, feedbackData);
}

setOpenDisplay(payload: { product_id: number; open_display: string;feedback_id:string}): Observable<any> {
  // Send the payload as the body of the POST request
  return this.http.post(`${this.apiUrl}/set_open_display`, payload);
}


getRangingcolumnData(userRole: number, catId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${userRole}/${catId}`);
}

getColumnVisibilityData(userRole: number, catId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/getRangingData/${userRole}/${catId}`);
}

//-------------------------------------------------Product Specification module---------------------------------------
getProductspecByCategory(categoryId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/productspec/${categoryId}`);
}

//-----------------------------------------------Incentive calculator---------------------------------------------------
 // Method to calculate incentive
 calculateIncentive(userId: number): Observable<any> {
  const url = `${this.apiUrl}/calculate_incentive`;
  return this.http.post(url, { user_id: userId }, this.getHttpOptions());
}

// Method to calculate incentive from PPI
calculateIncentiveFromPPI(userId: number): Observable<any> {
  const url = `${this.apiUrl}/calculate_incentive_from_ppi`;
  return this.http.post(url, { user_id: userId }, this.getHttpOptions());
}

// HTTP options including headers
private getHttpOptions() {
  return {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
}

// getslogansData(endpoint: string): Observable<any> {
//   const url = `${this.apiUrl}/`;
//   return this.http.get(url);
// }

getslogansData(endpoint: string, data: any): Observable<any> {
  const url = `${this.apiUrl}/get_api_title_for_app`;
  return this.http.post(url, data);
}


// this.apiService.postData('get_api_title_for_app', payload).subscribe({
//   next: (response) => {
//     console.log('API Response:', response);
//     // handle the response here
//   },
//   error: (error) => {
//     console.error('API Error:', error);
//   }



//--------------------------newcheckuserdocopentrack--------------------------
// Common method to track document opens
trackDocumentOpen(data: any): Observable<any> {
  const url = `${this.apiUrl}/trackDocumentOpen`; // Adjust the endpoint as necessary
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
    // Add any other headers if needed (e.g., Authorization)
  });
  
  return this.http.post(url, data, { headers });
}

// Method to get tracking data for a specific user
getTrackingData(userId: number): Observable<TrackingResponse> {
  return this.http.get<TrackingResponse>(`${this.apiUrl}/getTrackingData/${userId}`);
}

//-----------------------------------Method for reset password pta----------------------------------
resetPassword(email: string): Observable<any> {
  const requestBody = { email };
  return this.http.post(`${this.apiUrl}/reset_password`, requestBody);
}

//-----------------------------------Method for register user pta----------------------------------
registerUser(data:any): Observable<any> {
  return this.http.post(`${this.apiUrl}/register`, data); // Adjust URL as needed
  // return this.http.post(`${this.apiUrl}/reset_password`, requestBody);
}


changePassword(email: string, password: string): Observable<any> {
  const payload = {
    email: email,
    password: password
  };
  return this.http.post(`${this.apiUrl}/change_password`, payload);
}

//----------------------------------------Daily sales Module------------------------------------------
getPromoters(storeId: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/ownsales_promoters/${storeId}`);
}

fetchSalesData(
  countryId: number,
  retailerId: number,
  storeId: number,
  categoryId: number,
  modelId: number,
  promoterId: number,
  fromDate: string,
  toDate: string
): Observable<any> {
  const url = `${this.apiUrl}/ownsales_data/${countryId}/${retailerId}/${storeId}/${categoryId}/${modelId}/${promoterId}/${fromDate}/${toDate}`;
  return this.http.get<any>(url);
}

downloadSalesData(countryId: number, retailerId: number, storeId: number, categoryId: number, modelId: number, promoterId: number, fromDate: string, toDate: string): Observable<Blob> {
  const url = `${this.apiUrl}/ownsales_xls/${countryId}/${retailerId}/${storeId}/${categoryId}/${modelId}/${promoterId}/${fromDate}/${toDate}`;
  return this.http.get(url, { responseType: 'blob' });
}

getCompsalesData(

  countryId: number = 0,
  retailerId: number = 0,
  storeId: number = 0,
  categoryId: number = 0,
  model: string = '-1',
  brands: string[],
  fromDate: string,
  toDate: string
): Observable<any> {
  // Convert brands array into a comma-separated string
  const brandsParam = brands.join(',');

  // Set up the URL with parameters
  const url = `${this.apiUrl}/compsales_data/${countryId}/${retailerId}/${storeId}/${categoryId}/${model}/${brandsParam}/${fromDate}/${toDate}`;

  // Make the GET request
  return this.http.get<any>(url);
}

getProductsByCategorynBrands(brand:string, categoryId: number) {
  return this.http.get<any>(`${this.apiUrl}/sales_all_other_models/${brand}/${categoryId}`);
}

getBrands(): Observable<any> {
  return this.http.get(`${this.apiUrl}/sales_all_other_brands`);
}

submitSales(saleData: any): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  return this.http.post<any>(`${this.apiUrl}/sales_upload`, saleData, { headers });
}

submitcompSalesData(saleData: any): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  return this.http.post<any>(`${this.apiUrl}/competitor_sales_upload`, saleData, { headers });
}

//----------------------------------------------------Terms and condition status with app version -----------------------------------------------------------
updateTermsAndVersion(userId: number, termsStatus: number, appVersion: string): Observable<any> {
  const payload = {
    user_id: userId,
    terms_status: termsStatus,
    app_version: appVersion
  };
  
  return this.http.post(`${this.apiUrl}/updateTermsAndVersion`, payload); // Use POST for creating/updating
}
//------------------------------------------------------online webniar-----------------------------------------------------------------------------------
webinarLogin(request: LoginRequest): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/webinar_login`, request);
}

acceptTerms(userId: string, source: string): Observable<any> {
  const body = { userId, source };
  return this.http.post<any>(`${this.apiUrl}/terms_accept`, body);
}

loadWebinarList(request: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/select_language`,JSON.stringify(request));

}

webinarpostQuestion(request: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/webinar_question`,JSON.stringify(request));

}



//----------------------------------------------------Happy project modules------------------------
changeHpPassword(email: string, newPassword: string): Observable<any> {
  const body = { email, newPassword };
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post<any>(`${this.apiUrl}/happy_changepassword`, body, { headers });
}
//-----------------------------------------VMD checklist---------------------------------------------
getOutletPic(storeId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/outlet_pic/${storeId}`);
}

// Method to get special questions
getSpecialQuestions(catId: number, countryId: number): Observable<any> {
  const url = `${this.apiUrl}/special_questions?cat_id=${catId}&country_id=${countryId}`;
  return this.http.get(url);
}

// Method to post checklist answers
postChecklistAnswers(payload: any): Observable<any> {
  const url = `${this.apiUrl}/checklist_answers`; // Adjust the endpoint as necessary
  return this.http.post(url, payload);
}

// Function to submit feedback to the backend
submitVmdFeedback(feedbackData: FormData): Observable<any> {
  // Send the POST request with the feedback data as FormData
  const url = `${this.apiUrl}/insertChecklistImageFeedback`; // Adjust the endpoint as necessary
  return this.http.post(url, feedbackData);
}

getGeneratedStoreCode(): Observable<any> {
  const url = `${this.apiUrl}/checklist_autogenerated_store_code`;
  return this.http.get(url);
}

submitRetailerData(payload: { id: number; name: string }): Observable<any> {
  const url = `${this.apiUrl}/insert_update_retailer`; 
  return this.http.post(url, payload);
}

// Method to submit store data
submitStoreData(payload: any): Observable<any> {
  const url = `${this.apiUrl}/insert_update_outlet`;
  return this.http.post(url, payload);
}

//---------------------------------------------------------Promoter Assessment module---------------------------------------------
getPromotersByCountry(countryId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/promoterbycountry/${countryId}`);
}

getSpecialPromoterQuestions(categoryId: number, countryId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/special_promoter_questions/${categoryId}/${countryId}`);
}

getDailyPromoterQuestions(catId: number, countryId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/daily_special_promoter_questions/${catId}/${countryId}`);
}

submitpromoterAnswers(payload: any): Observable<any> {
  const url = `${this.apiUrl}/checklist_promoter_answers`;
  return this.http.post(url, payload);
}

submitDailyPromoterAnswers(payload: any): Observable<any> {
   const url = `${this.apiUrl}/checklist_daily_promoter_answer`;
  return this.http.post(url, payload);
}

// Function to submit feedback to the backend
submitPromoterFeedback(feedbackData: FormData): Observable<any> {
  // Send the POST request with the feedback data as FormData
  const url = `${this.apiUrl}/insertPromoterChecklistImageFeedback`; // Adjust the endpoint as necessary
  return this.http.post(url, feedbackData);
}

insertUpdatePromoter(promoterData: any): Observable<any> {
  // return this.http.post(`${this.baseUrl}/insert_update_promoter`, promoterData);
  const url = `${this.apiUrl}/insert_update_promoter`; // Adjust the endpoint as necessary
  return this.http.post(url, promoterData);
}

generateEmployeeCode(): Observable<any> {
  return this.http.get(`${this.apiUrl}/checklist_autogenerated_promoter_employee_code`);
}

//------------------------------------------------New Promoter kpi module-----------------
getKpiScore(userId: number, months: string): Observable<any> {
  const body = { user_id: userId, months: months };
  // return this.http.post<any>(this.apiUrl, body);
  const url = `${this.apiUrl}/kpi_score_api`; // Adjust the endpoint as necessary
  return this.http.post(url, body);
}


//-------------------------------------Happy New User Management--------------------------------------------

getPermissions(userRoleId: number): Observable<any> {
  // // Make an API call to get the permissions for the current user
  // return this.http.get<any>(`/api/permissions/${userRoleId}`);
  return this.http.get(`${this.apiUrl}/permissions?UserRoleId=${userRoleId}`);
}


// Function to get planogram area images by category_id and area_id
getPlanogramAreaImages(category_id: number, area_id: number): Observable<any> {
  const url = `${this.apiUrl}/planogram_area_images/${category_id}/${area_id}`;
  return this.http.get<any>(url);
}

// Method to post checklist answers
postAreaSlideData(payload: any): Observable<any> {
  const url = `${this.apiUrl}/planogram_feedback_slide`; 
  return this.http.post(url, payload);
}

get_slideFeedback(feedbackId: number, areaId: number) {
  const url = `${this.apiUrl}/get_planogram_feedback_slide/${feedbackId}/${areaId}`;
  return this.http.get(url);
}


 // Method to get areas by category ID
//  getCategoryStatus(categoryId: number): Observable<any> {
//   return this.http.get<any>(`${this.apiUrl}/areas/${categoryId}`);
// }

getCategoryStatus(categoryId: number) {
  const url = `${this.apiUrl}/areas/${categoryId}`;
  return this.http.get(url);
}

getUniqueAreasByFeedback(feedbackId: number): Observable<any> {
  const url = `${this.apiUrl}/get_unique_areas_by_feedback/${feedbackId}`;
  return this.http.get(url); 
}

// GET outlet assigned to user (store + retailer)
getOutletByUserId(userId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/getoutletbyuserid/${userId}`);
}

PlanogramFinalFeedback(fid: number, feedback: string): Observable<any> {
  const payload = {
    feedback: feedback,
    feedback_date: new Date().toISOString().split('T')[0], // Set current date
  };

  // Use POST method instead of PUT
  return this.http.post(`${this.apiUrl}/FeedbackUpdate/${fid}`, payload);
}



 // Method to fetch multi-region IDs
 getMultiRegionIds(userId:string): Observable<any> {
  // return this.http.get<any>(this.apiUrl);
  const url = `${this.apiUrl}/get_multi_region_id/${userId}`;
  return this.http.get(url);
}

 // Method to fetch multi-region IDs
 getMultiRegionIdsNames(userId:string): Observable<any> {
  // return this.http.get<any>(this.apiUrl);
  const url = `${this.apiUrl}/get_multi_region_names/${userId}`;
  return this.http.get(url);
}


getCountryData(countryId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/countryData/${countryId}`);
}

//profile page Avatar functionality

// Fetch User Avatar
getUserAvatar(userId: string): Observable<{ avatar: string }> {
  return this.http.get<{ avatar: string }>(`${this.apiUrl}/get_avatar/${userId}`);
}

// Update User Avatar
updateUserAvatar(userId: string, avatarUrl: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/update_avatar`, { userId, avatar: avatarUrl });
}

updateUserCountry(userId: string, cnt: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/update_country`, { userId, cntid: cnt });
}

update_user_noti(endpoint: string, data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/update_status`, data);
}

getUserNotistatus(userId: number): Observable<any> {
  return this.http.get<{ avatar: string }>(`${this.apiUrl}/get_status/${userId}`);
}




getCategoryDark(): Observable<any> {
  const url = 'https://ekarigartech.com/sony-erp/App_api/getcategory_dark';
  return this.http.get<any>(url);
}

getCategoryLight(): Observable<any> {
  const url = 'https://ekarigartech.com/sony-erp/App_api/getcategory_light';
  return this.http.get<any>(url);
}


}



// api-response.model.ts

export class WebinarListRequest {
  userId!: number; 
  source!: string;
  country_id!: number; 
  webinar_date!: string;
}

export interface Webinar {
  header: string;
  content: string;
}

export interface LoginRequest {
  userId: string;
  source: string;
}

 // Define an interface for a single tracking entry
interface TrackingEntry {
  id: string;
  user_id: string;
  country_id: string;
  module_id: string;
  module_doc_id: string;
  new_check_status: string;
  created_on: string;
  updated_on: string;
}

// Define an interface for the entire tracking response
interface TrackingResponse {
  status: boolean;
  data: TrackingEntry[];
}

export interface FeedbackDetail {
  id: string;
  feedback_id: string;
  product_id: string;
  available: string;
  open_display: string;
  open_display_boolean?: boolean;
  stock: string;
  is_ranging: string;
  attachment1_model_id: string | null;
  attachment2_model_id: string | null;
  attachment3_model_id: string | null;
  product_name: string | null;
  feedback:string | null;

}

export interface Feedback {
  length: number;
  id: string;
  user_id: string;
  store_id: string;
  category_id: string;
  feedback: string;
  feedback_date: string;
  created_on: string;
  store_name: string;
  retailer_name: string;
  details: FeedbackDetail[];
}


export interface Field {
  id: number;
  field_name: string;
  field_slug: string;
  created_on: string;
  category_id: number;
  status: number;
  category_name: string;
  multiple_select: number;
}

export interface Option {
  id: number;
  old_id: number;
  name: string;
  field_id: number;
  cat_id: number;
  status: number;
  created_on: string;
}

export interface ApiResponse<T> {
  status: boolean;
  message?: string; // Optional message
  data: T; // Generic type for data
}


interface UserProgressResponse {
  completedQuestions: number;
  remainingTime: string;
}

interface SalesTalkResponse {
  status: boolean;
  message?: string;
  training_pdfs: SalesTalkItem[];
}

interface CounterTalkResponse {
  status: boolean;
  message?: string;
  training_pdfs: SalesTalkItem[];
}

interface SalesTalkItem {
  id: number;
  title: string;
  body: string;
  url: string;
  fileType: string;
  isNew: boolean;
}
