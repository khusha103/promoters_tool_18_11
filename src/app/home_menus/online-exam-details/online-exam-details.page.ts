// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { AlertController } from '@ionic/angular';
// import { ApiService } from 'src/app/services/api.service';

// // interface ExamData {
// //   test_name: string;        // Name of the exam
// //   total_time: number;      // Total time allocated for the exam (in minutes or seconds)
// //   question_id: string;     // Comma-separated string of question IDs
// //   id: number;              // Unique identifier for the exam
// //   pass_per: number;        // Passing percentage required
// // }

// // Define the interface for exam details
// interface ExamDetail {
//   examTitle: string;         // Name of the exam
//   totalTime: string;        // Total time allocated for the exam (as a string)
//   totalQuestions: number;    // Total number of questions
//   examId: number;           // Unique identifier for the exam
//   examStatus: string;       // Status of the exam (e.g., 'not_started')
//   Timetitle: string;        // Title for total time
//   quesTitle: string;        // Title for total questions
//   passPercentage: number;    // Required passing percentage
// }

// @Component({
//   selector: 'app-online-exam-details',
//   templateUrl: './online-exam-details.page.html',
//   styleUrls: ['./online-exam-details.page.scss'],
// })
// export class OnlineExamDetailsPage implements OnInit {
// score: number = 0;
// testId: number = 0;
// userId: number = 0;
// examTitle!: string;
// totalTime!: string;
// remainingTime!: string;
// Timetitle!: string;
// quesTitle!: string;
// totalQuestions!: number;
// result_correctAnswers!: number;
// result_totalQuestions!: number;
// pass_percentage!: number;
// remainingQuestions!: number;
// examStatus!: 'started' | 'not_started';
// examId!: number; // Add examId property
// isExamInProgress: boolean = false; // Add this line
// hidetestbtn:boolean =false;


//   constructor(private route: ActivatedRoute,private router: Router,
//     private apiService: ApiService,private alertController: AlertController) { }

//     ngOnInit() {
//       const categoryId = this.route.snapshot.paramMap.get('categoryId');
//       const countryId = localStorage.getItem('cid'); // Get countryId from local storage
//       const roleId = localStorage.getItem('roleId'); // Get roleId from local storage
  
//       if (categoryId && countryId && roleId) {
//         this.fetchExamDetails(categoryId, countryId, roleId);
//       }
//     }
//     iscontent:boolean =false;
//     fetchExamDetails(categoryId: string, countryId: string, roleId: string) {
//       this.apiService.getExamDetails(+categoryId, +countryId, roleId).subscribe(
//         (response) => {
//           if (response.data.length > 0) {
//             const examData = response.data[0];
//             this.examTitle = examData.test_name;
//             this.totalTime = examData.total_time.toString();
//             this.totalQuestions = examData.question_id.split(',').length;
  
//             // Fetch remaining questions and time
//             this.examId = examData.id;
//             this.examStatus = 'not_started'; // Set exam status
//             this.Timetitle = "Total Time";
//             this.quesTitle = "Total Questions";
//             this.pass_percentage = examData.pass_per;
  
//             this.fetchUserProgress(); // Call method to get user progress
//             this.iscontent = true;

//           } else {
//             this.showAlert();
//             this.iscontent = false;
//           }
//         },
//         (error) => {
//           console.error('Error fetching exam details:', error);
//         }
//       );
//     }

// // examDetails:ExamData[] = [];

// // fetchExamDetails(categoryId: string) {
// //   this.apiService.getExamDetails(+categoryId).subscribe(
// //     (response) => {
// //       if (response.data.length > 0) {
// //         // Assuming response.data is an array of ExamData
// //         const examDetailsArray: ExamData[] = response.data.map((examData: ExamData) => {
// //           return {
// //             examTitle: examData.test_name,
// //             totalTime: examData.total_time.toString(),
// //             totalQuestions: examData.question_id.split(',').length,
// //             examId: examData.id,
// //             examStatus: 'not_started', // Set exam status
// //             Timetitle: "Total Time",
// //             quesTitle: "Total Questions",
// //             passPercentage: examData.pass_per
// //           };
// //         });

// //         // Optionally, store this array in a class property for further use
// //         this.examDetails = examDetailsArray;

// //         console.log(this.examDetails);
// //       //   [
// //       //     {
// //       //         "examTitle": "nov test",
// //       //         "totalTime": "13",
// //       //         "totalQuestions": 2,
// //       //         "examId": "11",
// //       //         "examStatus": "not_started",
// //       //         "Timetitle": "Total Time",
// //       //         "quesTitle": "Total Questions",
// //       //         "passPercentage": "25"
// //       //     },
// //       //     {
// //       //         "examTitle": "nov test",
// //       //         "totalTime": "13",
// //       //         "totalQuestions": 1,
// //       //         "examId": "12",
// //       //         "examStatus": "not_started",
// //       //         "Timetitle": "Total Time",
// //       //         "quesTitle": "Total Questions",
// //       //         "passPercentage": "25"
// //       //     },
// //       //     {
// //       //         "examTitle": "nov test",
// //       //         "totalTime": "13",
// //       //         "totalQuestions": 1,
// //       //         "examId": "13",
// //       //         "examStatus": "not_started",
// //       //         "Timetitle": "Total Time",
// //       //         "quesTitle": "Total Questions",
// //       //         "passPercentage": "25"
// //       //     }
// //       // ]

// //         // Call method to get user progress (if applicable)
// //         this.fetchUserProgress();
// //       } else {
// //         this.showAlert();
// //       }
// //     },
// //     (error) => {
// //       console.error('Error fetching exam details:', error);
// //     }
// //   );
// // }


// // examDeals: ExamDetail[] = []; // Define the property to hold exam details


// // fetchExamDetails(categoryId: string) {
// //   this.apiService.getExamDetails(+categoryId).subscribe(
// //     (response) => {
// //       if (response.data.length > 0) {
// //         const examDetailsArray: ExamDetail[] = response.data.map((examData: { test_name: any; total_time: { toString: () => any; }; question_id: { split: (arg0: string) => { (): any; new(): any; length: any; }; }; id: any; pass_per: any; }) => {
// //           return {
// //             examTitle: examData.test_name,
// //             totalTime: examData.total_time.toString(),
// //             totalQuestions: examData.question_id.split(',').length,
// //             examId: examData.id,
// //             examStatus: 'not_started', // Set exam status
// //             Timetitle: "Total Time",
// //             quesTitle: "Total Questions",
// //             passPercentage: examData.pass_per
// //           };
// //         });

// //         // Assigning the mapped array to this.examDeals
// //         this.examDeals = examDetailsArray;

// //         // Call method to get user progress (if applicable)
// //         this.fetchUserProgress();
// //       } else {
// //         this.showAlert();
// //       }
// //     },
// //     (error) => {
// //       console.error('Error fetching exam details:', error);
// //     }
// //   );
// // }

// async showAlert() {
//   const alert = await this.alertController.create({
//     header: 'Notification',
//     message: 'Monthly exam data is not found.',
//     buttons: [
//       {
//         text: 'OK',
//         handler: () => {
//           // Redirect to home page when OK is clicked
//           this.router.navigate(['/home']); // Adjust the route as necessary
//         }
//       }
//     ]
//   });

//   await alert.present();
// }

// async calculateScore() {

//   let userIdString = localStorage.getItem('userId');
  
//   if (userIdString) {
//     // Convert userIdString to number
//     this.userId = +userIdString;

//     console.log("exam id",this.examId);
//     console.log("userid",this.userId);
//   }
//   // Call the API service to submit the answers and get the score
//   const resultData = await this.apiService.calculateScore(this.userId, this.examId);
//   console.log(resultData);

//   this.result_totalQuestions = resultData.total_questions;
//   this.result_correctAnswers = resultData.correct_answers;
//   // percentage = resultData.percentage;

//   // Assuming the response contains a score percentage
//   if (resultData.status) {
//       this.score = resultData.percentage; // Store the percentage score
//       console.log(this.score);
//   }
// }

// fetchUserProgress() {
//   // Get userId from local storage and convert it to a number
//   let userIdString = localStorage.getItem('userId');
  
//   if (userIdString) {
//     // Convert userIdString to number
//     let userId = +userIdString;

//     console.log("exam id",this.examId);
//     console.log("userid",userId);

    

//     this.apiService.getUserProgress(this.examId, userId).subscribe(
//       (progressData) => {
//         console.log(progressData);
//         // Calculate remaining questions
//         this.remainingQuestions = this.totalQuestions - progressData.completedQuestions;
//         this.remainingTime = Math.floor(parseFloat(progressData.remainingTime)).toString(); // converts "12.95" to "12"
        
//         this.totalTime = this.remainingTime || this.totalTime; 
//         if(progressData.completedQuestions>0){
//         this.Timetitle = "Remaining time";
//         this.quesTitle = "Remaining Questions";
       
//         this.isExamInProgress = true;
//         if(this.remainingQuestions == 0 || this.remainingTime == "0"){
//           console.log("hide btn");
//           this.hidetestbtn = true;
//           this.calculateScore();
//         }
//         }
//       },
//       (error) => {
//         console.error('Error fetching user progress:', error);
//         // Fallback to total questions if an error occurs
//         this.remainingQuestions = this.totalQuestions; 
//       }
//     );
//   } else {
//     console.error('User ID not found in local storage.');
//     // Handle the case where userId is not found
//     this.remainingQuestions = this.totalQuestions; // Fallback to total questions
//   }
// }

// getQuestionCount() {
//   return this.quesTitle === 'Remaining Questions' ? this.remainingQuestions : this.totalQuestions;
// }

//   // // Method to navigate to the questions page
//   // startExam() {
//   //   this.router.navigate(['/online-exam-ques', {
//   //     categoryId: this.route.snapshot.paramMap.get('categoryId'),
//   //     examId: this.examId,
//   //     examTitle: this.examTitle,
//   //     totalTime: this.totalTime,
//   //     totalQuestions: this.totalQuestions
//   //   }]);
//   // }


//   startExam(isResuming: boolean = false) {
//     this.router.navigate(['/online-exam-ques', {
//       categoryId: this.route.snapshot.paramMap.get('categoryId'),
//       examId: this.examId,
//       examTitle: this.examTitle,
//       totalTime: isResuming ? this.remainingTime : this.totalTime, // Use remaining time if resuming
//       totalQuestions: isResuming ? this.remainingQuestions : this.totalQuestions // Use remaining questions if resuming


      
//     }]);
    
//   }

  
// // examData: any[]= [];
// // examTitles: string[] = []; // Array to hold exam titles
// // totalTimes: string[] = []; // Array to hold remaining times
// // totalQuestionsList: number[] = []; // Array to hold total questions
// // remainingQuestionsList: number[] = []; // Array to hold remaining questions
// // examStatusList: string[] = []; // Array to hold exam status

//   // fetchExamDetails(categoryId: string) {
//   //   this.apiService.getExamDetails(+categoryId).subscribe(
//   //     (data) => {
//   //       if (data.length > 0) {
//   //         this.examData = data; // Assign the entire data array to examData
//   //         this.populateExamDetails(); // Call a separate method to populate exam details
//   //       }
//   //     },
//   //     (error) => {
//   //       console.error('Error fetching exam details:', error);
//   //     }
//   //   );
//   // }
  
//   // populateExamDetails() {
//   //   this.examData.forEach((examData) => {
//   //     this.examTitles.push(examData.test_name);
//   //     this.totalTimes.push(examData.total_time.toString());
//   //     this.totalQuestionsList.push(examData.question_id.split(',').length);
//   //     // this.remainingQuestionsList.push(examData.question_id.split(',').length);
//   //     this.examStatusList.push(examData.status === '1' ? 'started' : 'not_started');
//   //   });
//   // }



// }


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';


// Define the interface for exam details
interface ExamDetail {
  examTitle: string;         // Name of the exam
  totalTime: string;        // Total time allocated for the exam (as a string)
  totalQuestions: number;    // Total number of questions
  examId: number;           // Unique identifier for the exam
  examStatus: string;       // Status of the exam (e.g., 'not_started')
  Timetitle: string;        // Title for total time
  quesTitle: string;        // Title for total questions
  passPercentage: number;    // Required passing percentage
}

@Component({
  selector: 'app-online-exam-details',
  templateUrl: './online-exam-details.page.html',
  styleUrls: ['./online-exam-details.page.scss'],
})
export class OnlineExamDetailsPage implements OnInit {
score: number = 0;
testId: number = 0;
userId: number = 0;
examTitle!: string;
totalTime!: string;
remainingTime!: string;
Timetitle!: string;
quesTitle!: string;
totalQuestions!: number;
result_correctAnswers!: number;
result_totalQuestions!: number;
pass_percentage!: number;
remainingQuestions!: number;
examStatus!: 'started' | 'not_started';
examId!: number; // Add examId property
isExamInProgress: boolean = false; // Add this line
hidetestbtn:boolean =false;


  constructor(private route: ActivatedRoute,private router: Router,
    private apiService: ApiService,private alertController: AlertController,private authservice:AuthService) { }

    ngOnInit() {
      
      this.getUserRole();
    }

    fetchexamdetail(){
      const categoryId = this.route.snapshot.paramMap.get('categoryId');
      // const countryId = localStorage.getItem('cid'); 
      // const roleId = localStorage.getItem('roleId'); 
      const countryId = this.cid; 
      const roleId = this.roleId; 
  
      if (categoryId && countryId && roleId) {
        this.fetchExamDetails(categoryId, countryId, roleId);
      }
    }

    roleId: string | null = null;
    cid: string | null = null;
    errorMessage: string | null = null;
getUserRole() {
      const UserId = localStorage.getItem('userId');
      if (UserId) {
        this.authservice.getUserRole(UserId).subscribe({
          next: (response) => {
            if (response.status) {
              this.roleId = response.data.role_id; 
              this.cid=response.data.region_id;
              //when get roleid then call methods
              this.fetchexamdetail();
            } else {
              this.errorMessage = response.message; // Handle error message
            }
          },
          error: (error) => {
            console.error('API Error:', error);
            this.errorMessage = 'Failed to retrieve user role. Please try again later.';
          }
        });
      }
    }

    iscontent:boolean =false;
    fetchExamDetails(categoryId: string, countryId: string, roleId: string) {
      this.apiService.getExamDetails(+categoryId, +countryId, roleId).subscribe(
        (response) => {
          if (response.data.length > 0) {
            const examData = response.data[0];
            this.examTitle = examData.test_name;
            this.totalTime = examData.total_time.toString();
            this.totalQuestions = examData.question_id.split(',').length;
  
            // Fetch remaining questions and time
            this.examId = examData.id;
            this.examStatus = 'not_started'; // Set exam status
            this.Timetitle = "Total Time";
            this.quesTitle = "Total Questions";
            this.pass_percentage = examData.pass_per;
  
            this.fetchUserProgress(); // Call method to get user progress
            this.iscontent = true;

          } else {
            this.showAlert();
            this.iscontent = false;
          }
        },
        (error) => {
          console.error('Error fetching exam details:', error);
        }
      );
    }


async showAlert() {
  const alert = await this.alertController.create({
    header: 'Notification',
    message: 'Monthly exam data is not found.',
    buttons: [
      {
        text: 'OK',
        handler: () => {
          // Redirect to home page when OK is clicked
          this.router.navigate(['/home']); // Adjust the route as necessary
        }
      }
    ]
  });

  await alert.present();
}

async calculateScore() {

  let userIdString = localStorage.getItem('userId');
  
  if (userIdString) {
    // Convert userIdString to number
    this.userId = +userIdString;

    console.log("exam id",this.examId);
    console.log("userid",this.userId);
  }
  // Call the API service to submit the answers and get the score
  const resultData = await this.apiService.calculateScore(this.userId, this.examId);
  console.log(resultData);

  this.result_totalQuestions = resultData.total_questions;
  this.result_correctAnswers = resultData.correct_answers;
  // percentage = resultData.percentage;

  // Assuming the response contains a score percentage
  if (resultData.status) {
      this.score = resultData.percentage; // Store the percentage score
      console.log(this.score);
  }
}

fetchUserProgress() {
  // Get userId from local storage and convert it to a number
  let userIdString = localStorage.getItem('userId');
  
  if (userIdString) {
    // Convert userIdString to number
    let userId = +userIdString;

    console.log("exam id",this.examId);
    console.log("userid",userId);

    

    this.apiService.getUserProgress(this.examId, userId).subscribe(
      (progressData) => {
        console.log(progressData);
        // Calculate remaining questions
        this.remainingQuestions = this.totalQuestions - progressData.completedQuestions;
        this.remainingTime = Math.floor(parseFloat(progressData.remainingTime)).toString(); // converts "12.95" to "12"
        
        this.totalTime = this.remainingTime || this.totalTime; 
        if(progressData.completedQuestions>0){
        this.Timetitle = "Remaining time";
        this.quesTitle = "Remaining Questions";
       
        this.isExamInProgress = true;
        if(this.remainingQuestions == 0 || this.remainingTime == "0"){
          console.log("hide btn");
          this.hidetestbtn = true;
          this.calculateScore();
        }
        }
      },
      (error) => {
        console.error('Error fetching user progress:', error);
        // Fallback to total questions if an error occurs
        this.remainingQuestions = this.totalQuestions; 
      }
    );
  } else {
    console.error('User ID not found in local storage.');
    // Handle the case where userId is not found
    this.remainingQuestions = this.totalQuestions; // Fallback to total questions
  }
}

getQuestionCount() {
  return this.quesTitle === 'Remaining Questions' ? this.remainingQuestions : this.totalQuestions;
}

  // // Method to navigate to the questions page
  // startExam() {
  //   this.router.navigate(['/online-exam-ques', {
  //     categoryId: this.route.snapshot.paramMap.get('categoryId'),
  //     examId: this.examId,
  //     examTitle: this.examTitle,
  //     totalTime: this.totalTime,
  //     totalQuestions: this.totalQuestions
  //   }]);
  // }


  startExam(isResuming: boolean = false) {
    this.router.navigate(['/online-exam-ques', {
      categoryId: this.route.snapshot.paramMap.get('categoryId'),
      examId: this.examId,
      examTitle: this.examTitle,
      totalTime: isResuming ? this.remainingTime : this.totalTime, // Use remaining time if resuming
      totalQuestions: isResuming ? this.remainingQuestions : this.totalQuestions // Use remaining questions if resuming


      
    }]);
    
  }



}

