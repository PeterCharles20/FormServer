import {Component, Input, NgModule, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AppComponent} from '../app.component';
import {
    CheckboxField,
    DynamicField,
    NgXformEditSaveComponent,
    NgXformModule, NumberField, RadioGroupField,
    SelectField,
    TextField
} from '@esss/ng-xform';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Title} from '@angular/platform-browser';
import {Validators} from '@angular/forms';

import {ActivatedRoute, RouterModule} from '@angular/router';
import {Survey} from '../Survey';

import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

@NgModule({
  declarations: [AppComponent] ,
    imports: [NgXformModule, RouterModule],
  bootstrap: [AppComponent]
})
export class FormComponent implements OnInit, OnDestroy {

  @ViewChild(NgXformEditSaveComponent) xformComponent: NgXformEditSaveComponent;
  @ViewChild('customField') customFieldTmpl: TemplateRef<any>;

    @Input() survey: Survey;
    @Input() tabTitle: string;


  public onchangefn = new Subject<string>();

  public fields: DynamicField[];
  public horizontal = false;
  public labelWidth = 1000;
  public model: any;
  public outputhelper = {A: 1, B: 2, C: 3};
  public subscriptions: Subscription[] = [];
  public editing = true;

  constructor(
        private titleService: Title,
        private http: HttpClient
  ) {}

  ngOnInit() {
    const minDate = new Date();
    const maxDate = new Date();

    this.subscriptions.push(this.onchangefn.asObservable().subscribe(
      (value: any) => this.xformComponent.setValue({outputopt: this.outputhelper[value]})
    ));

    minDate.setDate(minDate.getDate() - 3);
    maxDate.setDate(maxDate.getDate() + 3);
    this.titleService.setTitle(this.tabTitle);

    this.initField();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * This function is used to init the fields array.
   * The fields will be used to display the different type of questions
   */
  public initField(): void {

      this.fields = [
          new TextField({
              key: 'first_name',
              label: 'First Name',
          }),
          new TextField({
              key: 'last_name',
              label: 'Last Name',
          }),
          new TextField({
              key: 'mrn',
              label: 'Medical Record Number (MRN)',
          })
      ];

      for (let i = 0; i < this.survey.assessments.length; i++) {
          this.removeField(i);
          let required = this.survey.assessments[i].assessmentRequired;
          switch (this.survey.assessments[i].assessmentDisplayType) {
              case 'Radio':
                  this.createRadioGroup(i, required);
                  break;
              case 'SelectMany':
                  this.createSelectMany(i, required);
                  break;
              case 'SelectOne':
                  this.createSelect(i, required);
                  break;
              case 'Text':
                  this.createText(i, required);
                  break;
              case 'Number':
                  this.createNumber(i, required);
                  break;
              default:
                  console.log("Invalid Type");
          }
      }
  }

    /**
     * This funtion is used to create a SelectField
     * @param i Is used to determine which assessment has been inputed
     */
    public createSelect(i: number, optional) {

        let options = this.createOptions(i);
        let validate = this.checkValidation(optional);
        let tempField: SelectField;

        // Check if field already exists
        if (this.fieldCheck(i, 'SELECT')) {
            this.removeField(i);
        }
        // Push new select into the fields array
        tempField = new SelectField({
            key: this.survey.assessments[i].assessmentId.toString(),
            label: this.survey.assessments[i].assessmentDescription,
            searchable: false,
            options: options,
            addNewOption: true,
            addNewOptionText: 'id',
            optionLabelKey: 'choiceDesc',
            validators: [
                validate,
                Validators.minLength(1)
            ],
        });
        const delta = Number(this.survey.assessments[i].assessmentDelta);
        this.orderField(delta, tempField);
    }

    /**
     * This funtion is used to create a SelectField
     * @param i Is used to determine which assessment has been inputed
     */
    public createSelectMany(i: number, optional: string) {

        let options = this.createOptions(i);
        let validate = this.checkValidation(optional);
        let tempField: SelectField;

        // Check if field already exists
        if (this.fieldCheck(i, 'SELECT')) {
            this.removeField(i);
        }
        // Push new select into the fields array
        tempField = new SelectField({
            key: this.survey.assessments[i].assessmentId.toString(),
            label: this.survey.assessments[i].assessmentDescription,
            searchable: true,
            options: options,
            addNewOption: true,
            addNewOptionText: 'id',
            optionLabelKey: 'choiceDesc',
            multiple: true,
            validators: [
                validate,
                Validators.minLength(1)
            ]
        });
        const delta = Number(this.survey.assessments[i].assessmentDelta);
        this.orderField(delta, tempField);
    }

    /**
     * This funtion is used to create a RadioGroup
     * @param i Is used to determine which assessment has been inputed
     */
    public createRadioGroup(i: number, optional: string) {

        let options = this.createOptions(i);
        let validate = this.checkValidation(optional);
        let tempField: RadioGroupField;

        // Check if field already exists
        if (this.fieldCheck(i, 'RADIOGROUP')) {
            return;
        }
        // Push new radio group into the fields array
        tempField = new RadioGroupField({
            key: this.survey.assessments[i].assessmentId.toString(),
            label: this.survey.assessments[i].assessmentDescription,
            options: of(options).pipe(delay(10)),
            optionValueKey: 'id',
            optionLabelKey: 'choiceDesc',
            validators: [
                validate,
                Validators.minLength(1)
            ]
        });
        const delta = Number(this.survey.assessments[i].assessmentDelta);
        this.orderField(delta, tempField);
    }

    /**
     * Used to create a TextField
     * @param i Is used to determine which assessment has been inputed
     */
    public createText(i: number, optional: string) {

        let tempField: TextField;
        let validate = this.checkValidation(optional);
        // Check if field already exists
        if (this.fieldCheck(i, 'TEXT')) {
            return;
        }
        // Push new text field into the fields array
        tempField = new TextField({
            key: this.survey.assessments[i].assessmentId,
            label: this.survey.assessments[i].assessmentDescription,
            validators: [
                validate,
                Validators.minLength(1)
            ]
        });
        const delta = Number(this.survey.assessments[i].assessmentDelta);
        this.orderField(delta, tempField);

    }

    /**
     * Used to create a NumberField
     * @param i Is used to determine which assessment has been inputed
     */
    public createNumber(i: number, optional: string): void {

        let tempField: NumberField;
        let validate = this.checkValidation(optional);
        // Check if field already exists
        if (this.fieldCheck(i, 'NUMBER')) {
            return;
        }
        // Push new number field into the fields array
        tempField = new NumberField({
            key: this.survey.assessments[i].assessmentId,
            label: this.survey.assessments[i].assessmentDescription,
            validators: [
                validate,
                Validators.minLength(1)
            ]
        });
        const delta = Number(this.survey.assessments[i].assessmentDelta);
        this.orderField(delta, tempField);
    }

    /**
     * This function will return a boolean whether or not an element already exists in the array
     * @param i
     * i is the index of the array which will be checked
     * @param fieldType
     */
    public fieldCheck(i: number, fieldType: string): boolean {
        let j = 0;
        let validator;
        validator = this.checkValidation(this.survey.assessments[i].assessmentRequired);
        for (j; j < this.fields.length; j++) {
            if (this.fields[j].key === this.survey.assessments[i].assessmentId && fieldType === this.fields[j].controlType
                && this.fields[j].validators[0] === validator) {
                return true;
            } else if (this.fields[j].key === this.survey.assessments[i].assessmentId) {
                this.removeField(j);
                return false;
            }
        }
        return false;
    }

    /**
     * This function will remove a specified element in the fields array
     * @param i
     * i is the index of the array which will be removed
     */
    public removeField(i: number) {
        this.fields.splice(i, 1);
    }

    /**
     * This function is used to order the position of a newly added field
     * @param i
     * i is the index of the array which will be added
     */
    public orderField(i: number, field: any) {
        this.fields.splice(i, 0, field);
    }

    public createOptions(i: number): any[] {
        let options = [];
        this.survey.assessments[i].assessmentChoices.forEach(element => {
            options.push((element.choiceId, element.choiceDescription));
        });
        return options;
    }

  public onSubmit(values: object) {
    this.model = values;
    const payload = JSON.stringify(this.model);
    console.log(payload);
  }

    public checkValidation(optional: string) {
        let validate;
        if(optional === '0') {
            validate = Validators.minLength(1);
        } else {
            validate = Validators.required;
        }
        return validate;
    }

    /**
     * Determines if positions are equal to each other
     * @param x start position
     * @param y new position
     */
    public checkPos(x: number, y: number) : number {
        if(x === y) {
            return x;
        } else {
            return y;
        }
    }
}
