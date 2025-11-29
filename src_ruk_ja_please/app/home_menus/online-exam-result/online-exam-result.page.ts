import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';


// interface Option {
//   answer_id: string;
//   question_id: string;
//   options: string;
//   options_ar: string;
//   is_right: string;
//   created_on: string;
//   status: string;
// }

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

interface Result {
  question_id: string;
  question: string;
  question_ar:string;
  question_fr:string;
  question_ru:string;
  options: Option[];
  user_answer_id: string;
  is_correct: boolean;
}

interface ScoreResult {
  status: boolean;
  total_questions: number;
  correct_answers: number;
  percentage: number;
}

@Component({
  selector: 'app-online-exam-result',
  templateUrl: './online-exam-result.page.html',
  styleUrls: ['./online-exam-result.page.scss'],
})
export class OnlineExamResultPage implements OnInit {
  score: number = 0;
  testId: number = 0;
  userId: number = 0;
  results: any[] = [];
  suggestiveMessage!: string;
  questions: any[] = []; // Store questions
  userAnswers: { [key: string]: string } = {}; // Store user answers
  showResults: boolean = false; // Control visibility of results
  selectedLanguage: string = 'en'; // Default language
  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {}

  ngOnInit() {

     // Get language from localStorage
     const storedLang = localStorage.getItem('lang');
     this.selectedLanguage = storedLang ? storedLang : 'en'; // Set to stored language or default to 'en'

    const scoreParam = this.route.snapshot.paramMap.get('score');
    const testIdParam = this.route.snapshot.paramMap.get('testId'); // Retrieve testId from route 
    const flag = this.route.snapshot.paramMap.get('flag');//got flag timout then message show timeout
    // this.router.navigate(['/online-exam-result', { score: this.score, testId: testId,flag:"timeout"  }]);

    if (scoreParam && testIdParam && flag) {
      this.score = +scoreParam;
      this.testId = +testIdParam;
      this.userId = Number(localStorage.getItem('userId')); // Convert to number
      this.suggestiveMessage = this.getSuggestiveMessage(this.score,flag);
      this.fetchResults();
      this.calculateScore();
    } else {
      this.score = 0;
      this.suggestiveMessage = 'No score available.';
    }
  }

  getLocalizedResultQuestion(result: Result): string {
    switch (this.selectedLanguage) {
      case 'ar':
        return result.question_ar;
      case 'fr':
        return result.question_fr;
      case 'ru':
        return result.question_ru;
      default:
        return result.question;
    }
  }
  
  getLocalizedResultOption(option: Option): string {
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

  async calculateScore() {
    // Call the API service to submit the answers and get the score
    const response = await this.apiService.calculateScore(this.userId, this.testId);
  
    // Assuming the response contains a score percentage
    if (response.status) {
        this.score = response.percentage; // Store the percentage score
    }
  }

  getSuggestiveMessage(score: number,flag : string): string {
if(flag !== "timeout"){
  if (score >= 80) {
    return 'Excellent! Keep up the good work.';
  } else if (score >= 60) {
    return 'Good job! You can improve further.';
  } else {
    return 'Keep practicing, you can do better next time.';
  }
  }else{
  return 'Timeout but your responses is saved check by click on show results';
  }
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  fetchResults() {
    this.apiService.getExamResults(this.userId, this.testId).subscribe(response => {
      if (response.status) {
        this.results = response.results; // Ensure this is an array
        this.processResults(); // Process results to extract questions and user answers
      } else {
        console.error("Failed to fetch results:", response.message);
      }
    });
  }

getCorrectAnswer(result: Result): string {
  const correctOption = result.options.find((option: Option) => option.is_right === '1');
  switch (this.selectedLanguage) {
    case 'ar':
      return correctOption ? correctOption.options_ar : 'Unknown';
    case 'fr':
      return correctOption ? correctOption.options_fr : 'Unknown';
    case 'ru':
      return correctOption ? correctOption.options_ru : 'Unknown';
    default:
     return correctOption ? correctOption.options : 'Unknown';
  }
  // return correctOption ? correctOption.options_ar : 'Unknown';
}

getUserAnswer(result: Result): string {
  const userOption = result.options.find((option: Option) => option.answer_id === result.user_answer_id);
  switch (this.selectedLanguage) {
    case 'ar':
      return userOption ? userOption.options_ar : 'Not answered';
    case 'fr':
      return userOption ? userOption.options_fr : 'Not answered';
    case 'ru':
      return userOption ? userOption.options_ru : 'Not answered';
    default:
      return userOption ? userOption.options : 'Not answered';
  }
  // return userOption ? userOption.options_ar : 'Not answered';
}

processResults() {
  this.results = this.results.map((result: any): Result => {
    return {
      ...result,
      is_correct: result.is_correct === true,
      options: result.options.map((option: any): Option => ({
        ...option,
        is_right: option.is_right
      }))
    };
  });
}
  // Implement the toggleResults method
  toggleResults() {
    this.showResults = !this.showResults; // Toggle the visibility of results
  }
}