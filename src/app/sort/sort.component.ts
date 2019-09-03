import {Component, OnInit, Provider} from '@angular/core';
import {TabView} from '../TabView';
import {Survey} from '../Survey';
import {Assessment} from '../Assessment';
import {Choice} from '../Choice';
import {HttpClient} from '@angular/common/http';
// import {ActivatedRoute} from '@angular/router';
import {SurveyService} from '../_services/survey.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css'],
})
export class SortComponent implements OnInit {

    /**
     * The id from the URL is linked to the entity ID of the tabview
     */
    private id = +this.route.snapshot.paramMap.get('id');
    /**
     * Stores an array of TabViews that have been imported from Drupal
     */
    private tabViews: TabView [];
    /**
     * An instance of a Survey
     */
    private survey: Survey;

    private tabTitle: string;

  constructor(
      private http: HttpClient,
      private route: ActivatedRoute,
      private formService: SurveyService
  ) { }

  ngOnInit() {
      this.getTabView();
  }

    /**
     * GET tab views
     * Async task that uses the service class to interface with Drupal
     * Retrieved data from drupal is then stored into an array of TabViews
     * Once completed, the TabViews are then sorted into the Survey Class
     */
    public getTabView() {
        this.formService.getTabView(this.id)
            .subscribe(
                data => this.tabViews = data, // Move data into TabView
                err => console.log(err), // Log any Errors
                () => this.sortSurvey()); // Sort tabviews into a Survey
    }

    /**
     * Sorts out the tabviews that were retrieved from Drupal
     * Creates assessments and their choices by iterating through the tabviews
     * Once an assessment is created and it's choices have been populated
     * Then it is added into the Survey
     */
    public sortSurvey(): void {

        this.tabTitle = this.tabViews[0].tabViewLabel;

        this.createSurvey(); // Create an instance of a survey

        let tempAssessment: Assessment; // Create an instance of an assessment
        let cPos = 0; // Holds position of choices
        let aPos = 0; // Holds position of assessment

        this.tabViews.forEach((item, index, array) => {
            if (index === 0) { // Default statement
                tempAssessment = this.createAssessment(index); // Create a new assessment
                this.survey.addAssessment(tempAssessment);
                if (item.assessmentType.toString() === '4') {
                    this.survey.assessments[aPos].addChoice(this.createChoice(index, 4)); // Add a single choice to an assessment
                } else if (item.assessmentType.toString() === '5') {
                    this.survey.assessments[aPos].addChoice(this.createChoice(cPos, 5)); // Add a single a choice to an assessment
                    cPos++; // Update the position of the choice
                }
            } else if (item.assessmentType.toString() === '4') {
                tempAssessment = this.createAssessment(index); // Create a new assessment
                tempAssessment.addChoice(this.createChoice(index, 4)); // Add a single choice to an assessment
                this.survey.addAssessment(tempAssessment);
                aPos++; // Update the position of the assessment
            } else if (item.assessmentType.toString() === '5' && item.assessmentId === this.tabViews[index - 1].assessmentId) {
                this.survey.assessments[aPos].addChoice(this.createChoice(index, 5)); // Add a single a choice to an assessment
                cPos++; // Update the position of the choice
            } else if (item.assessmentType.toString() === '5' && item.assessmentId !== this.tabViews[index - 1].assessmentId) {
                cPos = 0; // Reset the position of the choice
                tempAssessment = this.createAssessment(index); // Create a new assessment
                tempAssessment.addChoice(this.createChoice(index, 5)); // Add a single a choice to an assessment
                this.survey.addAssessment(tempAssessment); // Add the assessment to the survey
                aPos++; // Update the position of the assessment
            }
        });
    }

    /**
     * Creates a new choice based on the assessment type
     * @param i
     * Index of the array
     * The assessment type
     */
    public createChoice(i: number, type: number): Choice {
        let tempChoices: Choice; // Create temp choice
        if (type === 4) {
            tempChoices = new Choice(
                4,
                'Type 4'
            );
            return tempChoices;
        } else {
            tempChoices = new Choice(
                this.tabViews[i].choiceId,
                this.tabViews[i].choiceDescription.trim()
            );
        }
        return tempChoices;
    }

    /**
     * Creates a new survey
     */
    public createSurvey(): void {
        this.survey = new Survey(
            this.tabViews[0].tabViewId,
            this.tabViews[0].tabViewLabel
        );
    }
    /**
     * Init temp assessment
     * @param i
     * Index of the array
     */
    public createAssessment(i: number): Assessment {
        const tempAssessment = new Assessment(
            this.tabViews[i].assessmentId,
            this.tabViews[i].assessmentType,
            this.tabViews[i].assessmentDescription.trim()
        );
        return tempAssessment;
    }

}
