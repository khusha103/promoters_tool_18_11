import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
{
  path: 'selfie-attendance',
  loadChildren: () => import('./pages/selfie-attendance/selfie-attendance.module')
    .then(m => m.SelfieAttendancePageModule)
},
  {
    path: 'splash',
    loadChildren: () => import('./pages/splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'app-selector',
    loadChildren: () => import('./pages/app-selector/app-selector.module').then( m => m.AppSelectorPageModule)
  },
  {
    path: 'pta-login',
    loadChildren: () => import('./pta/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'happy-login',
    loadChildren: () => import('./happy/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pta/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pta/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'product-salestalk',
    loadChildren: () => import('./home_menus/product-salestalk/product-salestalk.module').then( m => m.ProductSalestalkPageModule)
  },
  {
    path: 'product-specification',
    loadChildren: () => import('./home_menus/product-specification/product-specification.module').then( m => m.ProductSpecificationPageModule)
  },
  {
    path: 'product-countertalk',
    loadChildren: () => import('./home_menus/product-countertalk/product-countertalk.module').then( m => m.ProductCountertalkPageModule)
  },
  {
    path: 'display-guidelines',
    loadChildren: () => import('./home_menus/display-guidelines/display-guidelines.module').then( m => m.DisplayGuidelinesPageModule)
  },
  {
    path: 'latest-news',
    loadChildren: () => import('./home_menus/latest-news/latest-news.module').then( m => m.LatestNewsPageModule)
  },
  {
    path: 'service-related',
    loadChildren: () => import('./home_menus/service-related/service-related.module').then( m => m.ServiceRelatedPageModule)
  },
  {
    path: 'customer-information',
    loadChildren: () => import('./home_menus/customer-information/customer-information.module').then( m => m.CustomerInformationPageModule)
  },
  {
    path: 'planogram-ranging',
    loadChildren: () => import('./home_menus/planogram-ranging/planogram-ranging.module').then( m => m.PlanogramRangingPageModule)
  },
  {
    path: 'online-survey-feedback',
    loadChildren: () => import('./home_menus/online-survey-feedback/online-survey-feedback.module').then( m => m.OnlineSurveyFeedbackPageModule)
  },
  {
    path: 'promoter-kpi',
    loadChildren: () => import('./home_menus/promoter-kpi/promoter-kpi.module').then( m => m.PromoterKpiPageModule)
  },
  {
    path: 'attendance',
    loadChildren: () => import('./home_menus/attendance/attendance.module').then( m => m.AttendancePageModule)
  },
  {
    path: 'promoter-ranking',
    loadChildren: () => import('./home_menus/promoter-ranking/promoter-ranking.module').then( m => m.PromoterRankingPageModule)
  },
  {
    path: 'promoter-score',
    loadChildren: () => import('./home_menus/promoter-score/promoter-score.module').then( m => m.PromoterScorePageModule)
  },
  {
    path: 'planogram-feedback',
    loadChildren: () => import('./home_menus/planogram-feedback/planogram-feedback.module').then( m => m.PlanogramFeedbackPageModule)
  },
  {
    path: 'planogram-feedback-form',
    loadChildren: () => import('./home_menus/planogram-feedback-form/planogram-feedback-form.module').then( m => m.PlanogramFeedbackFormPageModule)
  },
  {
    path: 'planogram-ideal',
    loadChildren: () => import('./home_menus/planogram-ideal/planogram-ideal.module').then( m => m.PlanogramIdealPageModule)
  },
  {
    path: 'planogram-ranging-feedback',
    loadChildren: () => import('./home_menus/planogram-ranging-feedback/planogram-ranging-feedback.module').then( m => m.PlanogramRangingFeedbackPageModule)
  },
  {
    path: 'product-inner',
    loadChildren: () => import('./home_menus/product-inner/product-inner.module').then( m => m.ProductInnerPageModule)
  },
  {
    path: 'product-inner/:productName/:productImage/:seriesId/:categoryId/:sourcepage',
    loadChildren: () => import('./home_menus/product-inner/product-inner.module').then( m => m.ProductInnerPageModule)
  },
  {
    path: 'daily-sales',
    loadChildren: () => import('./home_menus/daily-sales/daily-sales.module').then( m => m.DailySalesPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./home_menus/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'upload-competitor-sales',
    loadChildren: () => import('./home_menus/upload-competitor-sales/upload-competitor-sales.module').then( m => m.UploadCompetitorSalesPageModule)
  },
  {
    path: 'upload-your-sales',
    loadChildren: () => import('./home_menus/upload-your-sales/upload-your-sales.module').then( m => m.UploadYourSalesPageModule)
  },
  {
    path: 'view-sales-competition',
    loadChildren: () => import('./home_menus/view-sales-competition/view-sales-competition.module').then( m => m.ViewSalesCompetitionPageModule)
  },
  {
    path: 'view-sales-sony',
    loadChildren: () => import('./home_menus/view-sales-sony/view-sales-sony.module').then( m => m.ViewSalesSonyPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./home_menus/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./home_menus/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'basic-details',
    loadChildren: () => import('./home_menus/basic-details/basic-details.module').then( m => m.BasicDetailsPageModule)
  },
  {
    path: 'promoter-kpi-inner',
    loadChildren: () => import('./home_menus/promoter-kpi-inner/promoter-kpi-inner.module').then( m => m.PromoterKpiInnerPageModule)
  },
  {
    path: 'daily-vmd-checklist',
    loadChildren: () => import('./home_menus/daily-vmd-checklist/daily-vmd-checklist.module').then( m => m.DailyVmdChecklistPageModule)
  },
  {
    path: 'register-new-retailer',
    loadChildren: () => import('./home_menus/register-new-retailer/register-new-retailer.module').then( m => m.RegisterNewRetailerPageModule)
  },
  {
    path: 'register-new-store',
    loadChildren: () => import('./home_menus/register-new-store/register-new-store.module').then( m => m.RegisterNewStorePageModule)
  },
  {
    path: 'register-new-promoter',
    loadChildren: () => import('./home_menus/register-new-promoter/register-new-promoter.module').then( m => m.RegisterNewPromoterPageModule)
  },
  {
    path: 'no-internet',
    loadChildren: () => import('./pages/no-internet/no-internet.module').then( m => m.NoInternetPageModule)
  },
  {
    path: 'server-down',
    loadChildren: () => import('./pages/server-down/server-down.module').then( m => m.ServerDownPageModule)
  },
  {
    path: 'online-exams',
    loadChildren: () => import('./home_menus/online-exams/online-exams.module').then( m => m.OnlineExamsPageModule)
  },
  {
    path: 'online-exam-category',
    loadChildren: () => import('./home_menus/online-exam-category/online-exam-category.module').then( m => m.OnlineExamCategoryPageModule)
  },
  {
    path: 'online-exam-details',
    loadChildren: () => import('./home_menus/online-exam-details/online-exam-details.module').then( m => m.OnlineExamDetailsPageModule)
  },
  {
    path: 'online-exam-ques',
    loadChildren: () => import('./home_menus/online-exam-ques/online-exam-ques.module').then( m => m.OnlineExamQuesPageModule)
  },
  {
    path: 'online-exam-result',
    loadChildren: () => import('./home_menus/online-exam-result/online-exam-result.module').then( m => m.OnlineExamResultPageModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./pages/test/test.module').then( m => m.TestPageModule)
  },
  {
    path: 'incentives-calculator',
    loadChildren: () => import('./home_menus/incentives-calculator/incentives-calculator.module').then( m => m.IncentivesCalculatorPageModule)
  },
  {
    path: 'update-ranging-feedback',
    loadChildren: () => import('./home_menus/update-ranging-feedback/update-ranging-feedback.module').then( m => m.UpdateRangingFeedbackPageModule)
  },
  {
    path: 'terms-and-conditions',
    loadChildren: () => import('./happy/terms-and-conditions/terms-and-conditions.module').then( m => m.TermsAndConditionsPageModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./happy/privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'dropdown-test',
    loadChildren: () => import('./pages/dropdown-test/dropdown-test.module').then( m => m.DropdownTestPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'daily-vmdchecklist-ques',
    loadChildren: () => import('./home_menus/daily-vmdchecklist-ques/daily-vmdchecklist-ques.module').then( m => m.DailyVmdchecklistQuesPageModule)
  },
  {
    path: 'daily-vmdchecklist-feedphoto',
    loadChildren: () => import('./home_menus/daily-vmdchecklist-feedphoto/daily-vmdchecklist-feedphoto.module').then( m => m.DailyVmdchecklistFeedphotoPageModule)
  },
  {
    path: 'online-webniar',
    loadChildren: () => import('./home_menus/online-webniar/online-webniar.module').then( m => m.OnlineWebniarPageModule)
  },
  {
    path: 'online-webniar-list',
    loadChildren: () => import('./home_menus/online-webniar-list/online-webniar-list.module').then( m => m.OnlineWebniarListPageModule)
  },
  {
    path: 'online-webniar-screen',
    loadChildren: () => import('./home_menus/online-webniar-screen/online-webniar-screen.module').then( m => m.OnlineWebniarScreenPageModule)
  },
  {
    path: 'promoters-assessment-ques',
    loadChildren: () => import('./home_menus/promoters-assessment-ques/promoters-assessment-ques.module').then( m => m.PromotersAssessmentQuesPageModule)
  },
  {
    path: 'promoters-assessment',
    loadChildren: () => import('./home_menus/promoters-assessment/promoters-assessment.module').then( m => m.PromotersAssessmentPageModule)
  },
    {
    path: 'daily-promoter-checklist',
    loadChildren: () => import('./home_menus/daily-promoter-checklist/daily-promoter-checklist.module').then( m => m.DailyPromoterChecklistPageModule)
  },
  {
    path: 'daily-promoter-checklist-ques',
    loadChildren: () => import('./home_menus/daily-promoter-checklist-ques/daily-promoter-checklist-ques.module').then( m => m.DailyPromoterChecklistQuesPageModule)
  },
  {
    path: 'planogram-area',
    loadChildren: () => import('./home_menus/planogram-area/planogram-area.module').then( m => m.PlanogramAreaPageModule)
  },
{
  path: 'selfie-attendance',
  loadChildren: () => import('./pages/selfie-attendance/selfie-attendance.module').then(m => m.SelfieAttendancePageModule),
  data: { reuse: true }
},
  {
    path: 'store-list',
    loadChildren: () => import('./pages/store-list/store-list.module').then( m => m.StoreListPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
