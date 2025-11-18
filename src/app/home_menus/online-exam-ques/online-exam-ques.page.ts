// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ApiService } from 'src/app/services/api.service';

// // interface Option {
// //   answer_id: string;
// //   question_id: string;
// //   options: string;
// //   options_ar: string;
// //   is_right: string;
// //   created_on: string;
// //   status: string;
// // }

// // interface Question {
// //   id: string;
// //   question: string;
// //   question_ar: string;
// //   created_on: string;
// //   status: string;
// //   exam_id: string;
// //   qmarks: string;
// //   options: Option[];
// // }

// interface Option {
//   answer_id: string;
//   question_id: string;
//   options: string;
//   options_ar: string;
//   options_fr: string;
//   options_ru: string;
//   is_right: string;
//   created_on: string;
//   status: string;
// }

// interface Question {
//   id: string;
//   question: string;
//   question_ar: string;
//   question_fr: string;
//   question_ru: string;
//   created_on: string;
//   status: string;
//   exam_id: string;
//   qmarks: string;
//   options: Option[];
// }

// interface SelectedOption {
//   question_id: string;
//   answer_id: string;
// }

// // interface Translations {
// //   [key: string]: {
// //     timeLeft: string;
// //     next: string;
// //     submitQuiz: string;
// //     question: string;
// //     of: string;
// //   };
// // }

// interface Translations {
//   [language: string]: {
//     [key: string]: string; // Explicit index signature for keys in inner object
//   };
// }

// @Component({
//   selector: 'app-online-exam-ques',
//   templateUrl: './online-exam-ques.page.html',
//   styleUrls: ['./online-exam-ques.page.scss'],
// })
// export class OnlineExamQuesPage implements OnInit {

//   remainingTime: string = '00:00'; // Initialize as a formatted string
//   totalTime: number | undefined; // Total time in seconds
//   currentQuestionIndex: number = 0;
//   selectedOption: string | null = null;
//   correctAnswers: string | null = null;
//   passPercentage: string | null = null;
//   // selectedOptions: string[] = [];
//   questions: any[] = [];
//   selectedOptions: SelectedOption[] = [];
//   timerInterval: any; // Interval for the timer
//   quizSubmitted = false;
//   score!: number;
//   showSubmitButton = false; // Flag to show submit button
//   userId!: number; // This will be set from local storage
//   testId!: number; // This should be set based on the exam being taken
//   sessionId: string = '-'; // Example session ID, replace with actual session ID

//   // New properties to hold passed parameters
//   categoryId: string | null = null;
//   examId: number | null = null;
//   examTitle: string | null = null;
//   totalQuestions: number | null = null;
//   selectedLanguage: string = 'en'; // Default language


//   translations: Translations = {
//     en: { timeLeft: 'Time Left', next: 'Next', submitQuiz: 'Submit Quiz', question: 'Question', of: 'of' },
//     ar: { timeLeft: 'الوقت المتبقي', next: 'التالي', submitQuiz: 'إرسال الاختبار', question: 'سؤال', of: 'من' },
//     fr: { timeLeft: 'Temps Restant', next: 'Suivant', submitQuiz: 'Soumettre le Quiz', question: 'Question', of: 'sur' },
//     ru: { timeLeft: 'Оставшееся время', next: 'Следующий', submitQuiz: 'Отправить тест', question: 'Вопрос', of: 'из' }
//   };
// // Add these new methods
// // getLocalizedText(key: string): string {
// //   return this.translations[this.selectedLanguage]?.[key] || this.translations['en'][key];
// // }

// getLocalizedText(key: string): string {
//   const text =
//     this.translations[this.selectedLanguage]?.[key] ||
//     this.translations['en']?.[key];

//   return text ?? key; // Fallback to the key itself if no translation is found
// }


//   constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService) { }

//   ngOnInit() {

//     //userid and examid get from previous page
//     //already get examid so why use testid 

//     // Get language from localStorage
//     const storedLang = localStorage.getItem('lang');
//     this.selectedLanguage = storedLang && this.translations[storedLang] ? storedLang : 'en'; // Set to stored language or default to 'en'

//     // Retrieve parameters from route
//     this.categoryId = this.route.snapshot.paramMap.get('categoryId');
//     if(this.categoryId)
//     this.fetchExamDetails(this.categoryId);
//     this.examId = Number(this.route.snapshot.paramMap.get('examId'));
//     this.examTitle = this.route.snapshot.paramMap.get('examTitle');

//     // Retrieve userId from local storage
//     const storedUserId = localStorage.getItem('userId');
//     this.userId = storedUserId ? +storedUserId : 0; // Convert to number, default to 0 if not found

//     // Get totalTime from route parameters and convert to number
//     const totalTimeStr = this.route.snapshot.paramMap.get('totalTime');
//     this.totalTime = totalTimeStr ? parseInt(totalTimeStr, 10) * 60 : 0; // Convert to seconds

//     const totalQuestionsStr = this.route.snapshot.paramMap.get('totalQuestions');
//     this.totalQuestions = totalQuestionsStr ? parseInt(totalQuestionsStr, 10) : 0; // Default to 0 if null

//     // if (this.examId) {
//     if (this.examId) {
//       this.fetchQuestions(this.examId);
//     }

//     // before send to starter function convert this totalTime to seconds as recieve in mins

//     // Start the timer
//     this.startTimer(this.totalTime);
//     //     await this.fetchQuestions("5");
//     // this.calculateScore();

//     // this.fetchQuestionAnswer();

    
    

//     setTimeout(async () => {
//       // this.calculateScore();
//     }, 5000); // 3000 milliseconds = 3 seconds

//   }

//   fetchQuestions(examId: number) {
//     this.apiService.getQuestionsByExam(examId).subscribe(
//       (data) => {
//         this.questions = data; // Assuming the API returns the questions with options
//         const totalQuestions = this.questions.length;
//     console.log("total questions",totalQuestions);
//         console.log("ques from api are", this.questions);
//         this.testId = data[0].exam_id;

//         // Calculate the starting index based on the remaining questions(use in resume test case)
//         if (this.totalQuestions) {
//           const startingIndex = this.questions.length - this.totalQuestions;
//           this.currentQuestionIndex = startingIndex >= 0 ? startingIndex : 0;

//           console.log("Starting from question index:", this.currentQuestionIndex);
//           console.log("Remaining Questions or total questions for fresh case:", this.totalQuestions);
//           console.log("Question Data:", this.questions);

//           // Load the first question to display based on the current index
//           this.loadCurrentQuestion();
//         }
//       },
//       (error) => {
//         console.error('Error fetching questions:', error);
//       }
//     );
//   }

//   loadCurrentQuestion() {
//     // Logic to load and display the current question based on the currentQuestionIndex
//     console.log("Current Question:", this.currentQuestion);
//     // Additional logic to render the question on the UI
//   }


//   get currentQuestion() {
//     return this.questions[this.currentQuestionIndex];
//   }

 

// getLocalizedQuestion(question: Question): string {
//   switch (this.selectedLanguage) {
//     case 'ar':
//       return question.question_ar;
//     case 'fr':
//       return question.question_fr;
//     case 'ru':
//       return question.question_ru;
//     default:
//       return question.question;
//   }
// }

// getLocalizedOption(option: Option): string {
//   switch (this.selectedLanguage) {
//     case 'ar':
//       return option.options_ar;
//     case 'fr':
//       return option.options_fr;
//     case 'ru':
//       return option.options_ru;
//     default:
//       return option.options;
//   }
// }


//   goToNextQuestion(questionId: number): Promise<void> {
//     return new Promise((resolve, reject) => {
//       console.log("Selected answer ID:", this.selectedOption);

//       if (this.selectedOption) {
//         // Call updateSelectedOption and wait for it to complete
//         this.updateSelectedOption(questionId, +this.selectedOption)
//           .then(() => {
//             // this.selectedOptions.push(this.selectedOption);
//             console.log("All selected options:", this.selectedOptions);

//             this.updateExamProgress();

//             if (this.currentQuestionIndex < this.questions.length - 1) {
//               this.currentQuestionIndex++;
//               this.selectedOption = null; // Reset selected option for the next question
//               resolve(); // Resolve when moving to the next question
//             } else {
//               // Handle exam completion (e.g., navigate to results page)
//               clearInterval(this.timerInterval); // Clear the timer
//               // this.router.navigate(['/online-exam-result']);
//               resolve(); // Resolve when exam is completed
//             }
//           })
//           .catch(error => {
//             console.error("Error updating selected option:", error);
//             reject(error); // Reject if there's an error in updating the option
//           });
//       } else {
//         console.log("No option selected for question ID:", questionId);
//         resolve(); // Resolve if no option is selected
//       }
//     });
//   }

//     updateSelectedOption(questionId: number, optionId: number): Promise<void> {
//       // Prepare data to send to the API
//       const data = {
//         user_id: this.userId,
//         test_id: this.testId,
//         question_id: questionId,
//         answer_id: optionId,
//         session_id: this.sessionId,
//       };

//       // Call the API to store the answer and return a Promise
//       return new Promise((resolve, reject) => {
//         this.apiService.storeAnswer(data).subscribe(
//           response => {
//             console.log('Answer stored successfully:', response);
//             resolve(); // Resolve the promise on success
//           },
//           error => {
//             console.error('Error storing answer:', error);
//             reject(error); // Reject the promise on error
//           }
//         );
//       });
//     }



//     updateExamProgress(): void {
//       console.log("during progress send ",this.remainingTime);
//       const remainingTimeInSeconds = this.convertTimeToSeconds(this.remainingTime);

//       this.apiService.updateExamProgress(this.userId, this.testId, remainingTimeInSeconds)
//         .subscribe(
//           response => {
//             console.log('Exam progress updated successfully:', response);
//           },
//           error => {
//             console.error('Error updating exam progress:', error);
//           }
//         );
//     }

//     convertTimeToSeconds(time: string): number {
//       const [minutes, seconds] = time.split(':').map(Number);
//       return minutes * 60 + seconds;
//     }


//   //   async submitQuiz(questionId: number) {
//   //     try {
//   //         // Move to the next question and wait for the promise to resolve + call to save last answer also
//   //         await this.goToNextQuestion(questionId);
          
//   //         // Clear the timer
//   //         clearInterval(this.timerInterval);

//   //         const userId = this.userId; 
//   //         const testId = this.testId; 
  
//   //         // Call the API service to submit the answers and get the score
//   //         const response = await this.apiService.calculateScore(userId, testId);
  
//   //         // Assuming the response contains a score percentage
//   //         if (response.status) {
//   //             this.score = response.percentage; // Store the percentage score
//   //             this.quizSubmitted = true;
  
//   //             // Navigate to the results page with the score
//   //             this.router.navigate(['/online-exam-result', { score: this.score, testId: testId,flag:"not timeout"  }]);
//   //         } else {
//   //             console.error("Failed to calculate score:", response.message);
//   //             // Handle the case where the score could not be calculated
//   //         }
//   //     } catch (error) {
//   //         console.error("Error saving answer:", error);
//   //         // Handle the error if needed
//   //     }
//   // }

//   // fetchExamDetails(categoryId: string) {
//   //   this.apiService.getExamDetails(+categoryId).subscribe(
//   //     (data) => {
//   //       console.log(data[0]);
//   //       if (data.length > 0) {
//   //         const examData = data[0];
//   //         this.passPercentage = examData.pass_per;
//   //         this.correctAnswers = examData.question_id.split(',').length;
//   //       //   console.log(this.passPercentage);
//   //       //  console.log("exam details from api",examData);
//   //       }
//   //     },
//   //     (error) => {
//   //       console.error('Error fetching exam details:', error);
//   //     }
//   //   );
//   // }
  
//   fetchExamDetails(categoryId: string) {
//     const countryId = localStorage.getItem('countryId'); // Get countryId from local storage
//     const roleId = localStorage.getItem('roleId'); // Get roleId from local storage
  
//     if (countryId && roleId) {
//       this.apiService.getExamDetails(+categoryId, +countryId, roleId).subscribe(
//         (response) => {
//           console.log(response.data[0]); // Log the first element of the response data
//           if (response.data.length > 0) {
//             const examData = response.data[0];
//             this.passPercentage = examData.pass_per; // Set pass percentage
//             this.correctAnswers = examData.question_id.split(',').length; // Count total questions
  
//             // Additional logging for debugging
//             console.log("Pass Percentage:", this.passPercentage);
//             console.log("Exam details from API:", examData);
//           } else {
//             // this.showAlert(); // Handle case where no data is returned
//           }
//         },
//         (error) => {
//           console.error('Error fetching exam details:', error);
//         }
//       );
//     } else {
//       console.error('Country ID or Role ID is missing in local storage.');
//       // this.showAlert(); // Handle case where IDs are not available
//     }
//   }

//   async submitQuiz(questionId: number) {
//     try {
//         // Move to the next question and wait for the promise to resolve + call to save last answer also
//         await this.goToNextQuestion(questionId);
        
//         // Clear the timer
//         clearInterval(this.timerInterval);

//         const userId = this.userId; 
//         const testId = this.testId; 

//         // Call the API service to calculate the score based on the current answers
//         const scoreResponse = await this.apiService.calculateScore(userId, testId);

//         // Assuming the response contains a score percentage
//         if (scoreResponse.status) {
//             this.score = scoreResponse.percentage; // Store the percentage score
//             this.passPercentage = scoreResponse.percentage;
//             this.correctAnswers = scoreResponse.correct_answers;
//             // this.passPercentage = "12";
//             // this.correctAnswers = "2";

//             // Prepare the data to submit
//             const data = {
//                 ut_user_id: userId.toString(),
//                 ut_test_id: testId,
//                 total_ques: this.totalQuestions?.toString(), // Total number of questions
//                 correct_ques: this.correctAnswers, // Number of correct answers
//                 exam_pass_per: this.passPercentage, // Pass percentage as a string
//                 percentage_obtained: this.score.toString() // Score percentage as a string
//             };

//             // Call the API service to submit the final quiz answers
//             const submitResponse = await this.apiService.submitQuizAnswers(data);

//             // Check if the submission was successful
//             if (submitResponse.status === 'success') {
//                 this.quizSubmitted = true;

//                 // Navigate to the results page with the score
//                 this.router.navigate(['/online-exam-result', { score: this.score, testId: testId, flag: "not timeout" }]);
//             } else {
//                 console.error("Failed to submit quiz answers:", submitResponse.message);
//                 // Handle the case where the answers could not be submitted
//             }
//         } else {
//             console.error("Failed to calculate score:", scoreResponse.message);
//             // Handle the case where the score could not be calculated
//         }
//     } catch (error) {
//         console.error("Error saving answer:", error);
//         // Handle the error if needed
//     }
// }

//   startTimer(totalTime: number) {
//     let timeLeft = totalTime;

//     this.timerInterval = setInterval(async () => {
//       timeLeft--;

//       if (timeLeft < 0) {
//         clearInterval(this.timerInterval);
//         this.remainingTime = '00:00';
//         // this.remainingTime = '0';

//         // Optionally, you can navigate to the results page or handle time up scenario
//         this.updateExamProgress();//onupdate timming detail in progress table no need to call store answer as on next click already store answer
//         const testId = this.testId; 
//         const userId = this.userId; 
//         // Call the API service to submit the answers and get the score
//           const response = await this.apiService.calculateScore(userId, testId);
  
//           // Assuming the response contains a score percentage
//           if (response.status) {
//               this.score = response.percentage; // Store the percentage score
//               this.quizSubmitted = true;
  
//               // Navigate to the results page with the score
//               this.router.navigate(['/online-exam-result', { score: this.score, testId: testId,flag:"timeout"  }]);
//           }
        
//       } else {
//         this.remainingTime = this.formatTime(timeLeft);
//       }
//     }, 1000);
//   }

//   formatTime(seconds: number): string {
//     const minutes: number = Math.floor(seconds / 60);
//     const secs: number = seconds % 60;
//     return `${this.padZero(minutes)}:${this.padZero(secs)}`;
//   }

//   padZero(num: number): string {
//     return num < 10 ? '0' + num : num.toString();
//   }


//   ngOnDestroy() {
//     // Clear the interval when the component is destroyed
//     if (this.timerInterval) {
//       clearInterval(this.timerInterval);
//     }
//   }


//   // submitQuiz(questionId: number) {
// //   // Call goToNextQuestion and wait for it to complete
// //   this.goToNextQuestion(questionId).then(() => {
// //     clearInterval(this.timerInterval); // Clear the timer

// //     this.score = this.calculateScore();
// //     console.log("Score here ", this.score);
// //     this.quizSubmitted = true;
// //     // this.router.navigate(['/online-exam-result', { score: this.score }]);
// //   }).catch(error => {
// //     console.error("Error saving answer:", error);
// //     // Handle error if needed
// //   });
// // }

// }


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

interface Option {
  answer_id: string;
  question_id: string;
  options: string;
  options_ar: string;
  options_fr: string;
  options_ru: string;
  is_right: string;
  created_on: string;
  status: string;
}

interface Question {
  id: string;
  question: string;
  question_ar: string;
  question_fr: string;
  question_ru: string;
  created_on: string;
  status: string;
  exam_id: string;
  qmarks: string;
  options: Option[];
}

interface SelectedOption {
  question_id: string;
  answer_id: string;
}


interface Translations {
  [language: string]: {
    [key: string]: string; // Explicit index signature for keys in inner object
  };
}

@Component({
  selector: 'app-online-exam-ques',
  templateUrl: './online-exam-ques.page.html',
  styleUrls: ['./online-exam-ques.page.scss'],
})
export class OnlineExamQuesPage implements OnInit {

  remainingTime: string = '00:00'; // Initialize as a formatted string
  totalTime: number | undefined; // Total time in seconds
  currentQuestionIndex: number = 0;
  selectedOption: string | null = null;
  correctAnswers: string | null = null;
  passPercentage: string | null = null;
  // selectedOptions: string[] = [];
  questions: any[] = [];
  selectedOptions: SelectedOption[] = [];
  timerInterval: any; // Interval for the timer
  quizSubmitted = false;
  score!: number;
  showSubmitButton = false; // Flag to show submit button
  userId!: number; // This will be set from local storage
  testId!: number; // This should be set based on the exam being taken
  sessionId: string = '-'; // Example session ID, replace with actual session ID

  // New properties to hold passed parameters
  categoryId: string | null = null;
  examId: number | null = null;
  examTitle: string | null = null;
  totalQuestions: number | null = null;
  selectedLanguage: string = 'en'; // Default language


  translations: Translations = {
    en: { timeLeft: 'Time Left', next: 'Next', submitQuiz: 'Submit Quiz', question: 'Question', of: 'of' },
    ar: { timeLeft: 'الوقت المتبقي', next: 'التالي', submitQuiz: 'إرسال الاختبار', question: 'سؤال', of: 'من' },
    fr: { timeLeft: 'Temps Restant', next: 'Suivant', submitQuiz: 'Soumettre le Quiz', question: 'Question', of: 'sur' },
    ru: { timeLeft: 'Оставшееся время', next: 'Следующий', submitQuiz: 'Отправить тест', question: 'Вопрос', of: 'из' }
  };
  // Add these new methods
  // getLocalizedText(key: string): string {
  //   return this.translations[this.selectedLanguage]?.[key] || this.translations['en'][key];
  // }

  getLocalizedText(key: string): string {
    const text =
      this.translations[this.selectedLanguage]?.[key] ||
      this.translations['en']?.[key];

    return text ?? key; // Fallback to the key itself if no translation is found
  }


  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService,private authservice:AuthService) { }

  ngOnInit() {
  this.getUserRole();
  }

    roleId: string | null = null;
    lang: string | null = null;
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
              // this.lang =response.data.language_code || 'en';
              //when get roleid then call methods
              this.intializeapp();
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

  intializeapp(){
    
    //userid and examid get from previous page
    //already get examid so why use testid 

    // Get language from localStorage
    const storedLang = localStorage.getItem('lang');
 

    this.selectedLanguage = storedLang && this.translations[storedLang] ? storedLang : 'en'; // Set to stored language or default to 'en'

    // Retrieve parameters from route
    this.categoryId = this.route.snapshot.paramMap.get('categoryId');
    if (this.categoryId)
      this.fetchExamDetails(this.categoryId);
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));
    this.examTitle = this.route.snapshot.paramMap.get('examTitle');

    // Retrieve userId from local storage
    const storedUserId = localStorage.getItem('userId');
    this.userId = storedUserId ? +storedUserId : 0; // Convert to number, default to 0 if not found

    // Get totalTime from route parameters and convert to number
    const totalTimeStr = this.route.snapshot.paramMap.get('totalTime');
    this.totalTime = totalTimeStr ? parseInt(totalTimeStr, 10) * 60 : 0; // Convert to seconds

    const totalQuestionsStr = this.route.snapshot.paramMap.get('totalQuestions');
    this.totalQuestions = totalQuestionsStr ? parseInt(totalQuestionsStr, 10) : 0; // Default to 0 if null

    // if (this.examId) {
    if (this.examId) {
      this.fetchQuestions(this.examId);
    }

    // before send to starter function convert this totalTime to seconds as recieve in mins

    // Start the timer
    this.startTimer(this.totalTime);
    //     await this.fetchQuestions("5");
    // this.calculateScore();

    // this.fetchQuestionAnswer();

    setTimeout(async () => {
      // this.calculateScore();
    }, 5000); // 3000 milliseconds = 3 seconds
  }

  fetchQuestions(examId: number) {
    this.apiService.getQuestionsByExam(examId).subscribe(
      (data) => {
        this.questions = data; // Assuming the API returns the questions with options
        const totalQuestions = this.questions.length;
        // console.log("total questions",totalQuestions);
        //     console.log("ques from api are", this.questions);
        this.testId = data[0].exam_id;

        // Calculate the starting index based on the remaining questions(use in resume test case)
        if (this.totalQuestions) {
          const startingIndex = this.questions.length - this.totalQuestions;
          this.currentQuestionIndex = startingIndex >= 0 ? startingIndex : 0;

          // console.log("Starting from question index:", this.currentQuestionIndex);
          // console.log("Remaining Questions or total questions for fresh case:", this.totalQuestions);
          // console.log("Question Data:", this.questions);

          // Load the first question to display based on the current index
          this.loadCurrentQuestion();
        }
      },
      (error) => {
        console.error('Error fetching questions:', error);
      }
    );
  }

  loadCurrentQuestion() {
    // Logic to load and display the current question based on the currentQuestionIndex
    console.log("Current Question:", this.currentQuestion);
    // Additional logic to render the question on the UI
  }


  get currentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }



  getLocalizedQuestion(question: Question): string {
    switch (this.selectedLanguage) {
      case 'ar':
        return question.question_ar;
      case 'fr':
        return question.question_fr;
      case 'ru':
        return question.question_ru;
      default:
        return question.question;
    }
  }

  getLocalizedOption(option: Option): string {
    switch (this.selectedLanguage) {
      case 'ar':
        return option.options_ar;
      case 'fr':
        return option.options_fr;
      case 'ru':
        return option.options_ru;
      default:
        return option.options;
    }
  }


  goToNextQuestion(questionId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      // console.log("Selected answer ID:", this.selectedOption);

      if (this.selectedOption) {
        // Call updateSelectedOption and wait for it to complete
        this.updateSelectedOption(questionId, +this.selectedOption)
          .then(() => {
            // this.selectedOptions.push(this.selectedOption);
            console.log("All selected options:", this.selectedOptions);

            this.updateExamProgress();

            if (this.currentQuestionIndex < this.questions.length - 1) {
              this.currentQuestionIndex++;
              this.selectedOption = null; // Reset selected option for the next question
              resolve(); // Resolve when moving to the next question
            } else {
              // Handle exam completion (e.g., navigate to results page)
              clearInterval(this.timerInterval); // Clear the timer
              // this.router.navigate(['/online-exam-result']);
              resolve(); // Resolve when exam is completed
            }
          })
          .catch(error => {
            console.error("Error updating selected option:", error);
            reject(error); // Reject if there's an error in updating the option
          });
      } else {
        console.log("No option selected for question ID:", questionId);
        resolve(); // Resolve if no option is selected
      }
    });
  }

  updateSelectedOption(questionId: number, optionId: number): Promise<void> {
    // Prepare data to send to the API
    const data = {
      user_id: this.userId,
      test_id: this.testId,
      question_id: questionId,
      answer_id: optionId,
      session_id: this.sessionId,
    };

    // Call the API to store the answer and return a Promise
    return new Promise((resolve, reject) => {
      this.apiService.storeAnswer(data).subscribe(
        response => {
          console.log('Answer stored successfully:', response);
          resolve(); // Resolve the promise on success
        },
        error => {
          console.error('Error storing answer:', error);
          reject(error); // Reject the promise on error
        }
      );
    });
  }



  updateExamProgress(): void {
    console.log("during progress send ", this.remainingTime);
    const remainingTimeInSeconds = this.convertTimeToSeconds(this.remainingTime);

    this.apiService.updateExamProgress(this.userId, this.testId, remainingTimeInSeconds)
      .subscribe(
        response => {
          console.log('Exam progress updated successfully:', response);
        },
        error => {
          console.error('Error updating exam progress:', error);
        }
      );
  }

  convertTimeToSeconds(time: string): number {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
  }


  fetchExamDetails(categoryId: string) {
    // const countryId = localStorage.getItem('countryId'); // Get countryId from local storage
    // const roleId = localStorage.getItem('roleId'); // Get roleId from local storage
    const countryId =this.cid; 
    const roleId = this.roleId; 

    if (countryId && roleId) {
      this.apiService.getExamDetails(+categoryId, +countryId, roleId).subscribe(
        (response) => {
          console.log(response.data[0]); // Log the first element of the response data
          if (response.data.length > 0) {
            const examData = response.data[0];
            this.passPercentage = examData.pass_per; // Set pass percentage
            this.correctAnswers = examData.question_id.split(',').length; // Count total questions

            // Additional logging for debugging
            console.log("Pass Percentage:", this.passPercentage);
            console.log("Exam details from API:", examData);
          } else {
            // this.showAlert(); // Handle case where no data is returned
          }
        },
        (error) => {
          console.error('Error fetching exam details:', error);
        }
      );
    } else {
      console.error('Country ID or Role ID is missing in local storage.');
      // this.showAlert(); // Handle case where IDs are not available
    }
  }

  async submitQuiz(questionId: number) {
    try {
      // Move to the next question and wait for the promise to resolve + call to save last answer also
      await this.goToNextQuestion(questionId);

      // Clear the timer
      clearInterval(this.timerInterval);

      const userId = this.userId;
      const testId = this.testId;

      // Call the API service to calculate the score based on the current answers
      const scoreResponse = await this.apiService.calculateScore(userId, testId);

      // Assuming the response contains a score percentage
      if (scoreResponse.status) {
        this.score = scoreResponse.percentage; // Store the percentage score
        this.passPercentage = scoreResponse.percentage;
        this.correctAnswers = scoreResponse.correct_answers;
        // this.passPercentage = "12";
        // this.correctAnswers = "2";

        // Prepare the data to submit
        const data = {
          ut_user_id: userId.toString(),
          ut_test_id: testId,
          total_ques: this.totalQuestions?.toString(), // Total number of questions
          correct_ques: this.correctAnswers, // Number of correct answers
          exam_pass_per: this.passPercentage, // Pass percentage as a string
          percentage_obtained: this.score.toString() // Score percentage as a string
        };

        // Call the API service to submit the final quiz answers
        const submitResponse = await this.apiService.submitQuizAnswers(data);

        // Check if the submission was successful
        if (submitResponse.status === 'success') {
          this.quizSubmitted = true;

          // Navigate to the results page with the score
          this.router.navigate(['/online-exam-result', { score: this.score, testId: testId, flag: "not timeout" }]);
        } else {
          console.error("Failed to submit quiz answers:", submitResponse.message);
          // Handle the case where the answers could not be submitted
        }
      } else {
        console.error("Failed to calculate score:", scoreResponse.message);
        // Handle the case where the score could not be calculated
      }
    } catch (error) {
      console.error("Error saving answer:", error);
      // Handle the error if needed
    }
  }

  startTimer(totalTime: number) {
    let timeLeft = totalTime;

    this.timerInterval = setInterval(async () => {
      timeLeft--;

      if (timeLeft < 0) {
        clearInterval(this.timerInterval);
        this.remainingTime = '00:00';
        // this.remainingTime = '0';

        // Optionally, you can navigate to the results page or handle time up scenario
        this.updateExamProgress();//onupdate timming detail in progress table no need to call store answer as on next click already store answer
        const testId = this.testId;
        const userId = this.userId;
        // Call the API service to submit the answers and get the score
        const response = await this.apiService.calculateScore(userId, testId);

        // Assuming the response contains a score percentage
        if (response.status) {
          this.score = response.percentage; // Store the percentage score
          this.quizSubmitted = true;

          // Navigate to the results page with the score
          this.router.navigate(['/online-exam-result', { score: this.score, testId: testId, flag: "timeout" }]);
        }

      } else {
        this.remainingTime = this.formatTime(timeLeft);
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const secs: number = seconds % 60;
    return `${this.padZero(minutes)}:${this.padZero(secs)}`;
  }

  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }


  ngOnDestroy() {
    // Clear the interval when the component is destroyed
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }


  // submitQuiz(questionId: number) {
  //   // Call goToNextQuestion and wait for it to complete
  //   this.goToNextQuestion(questionId).then(() => {
  //     clearInterval(this.timerInterval); // Clear the timer

  //     this.score = this.calculateScore();
  //     console.log("Score here ", this.score);
  //     this.quizSubmitted = true;
  //     // this.router.navigate(['/online-exam-result', { score: this.score }]);
  //   }).catch(error => {
  //     console.error("Error saving answer:", error);
  //     // Handle error if needed
  //   });
  // }

}

