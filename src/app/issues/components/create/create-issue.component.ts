import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { GithubIssueService } from '../../service/github-issue.service';

@Component({
  selector: 'app-create',
  templateUrl: './create-issue.component.html',
  styleUrl: './create-issue.component.scss'
})
export class CreateIssueComponent implements OnInit{
  
  protected githubIssueForm!: FormGroup;
  protected labels: any = [];
  labelsUrl: string = 'https://api.github.com/repos/Jojjeboy/pushIt/labels';
  issueFetched: boolean = false;
  labelsFetched: boolean = false;


  constructor(protected githubService: GithubIssueService){
    this.githubIssueForm = new FormGroup({
      title: new FormControl('', Validators.required),
      body: new FormControl('', [Validators.required]),
      labels: new FormArray([])
    });
  }


  ngOnInit(): void {
    this.getLabels(this.labelsUrl);
  }

  /**
   * Get all labels available for the passed url
   *
   * @param url: string - optional URL to fetch issues from.
   */
  getLabels(url: string): void {
    this.githubService.getLabels(url).subscribe((data) => {
      this.labelsFetched = true;
      //console.log(data.body)
      this.labels = data.body;
    });
  }


  addLabel(label: Object): void{
    // Check if it's already added
    let alreadyExist:boolean = false;
    for (let i = 0; i < this.githubIssueForm.value.labels.length; i++) {
      if (this.githubIssueForm.value.labels[i] === label) {
        alreadyExist = true;
      }
    }

    if(!alreadyExist){
      this.githubIssueForm.value.labels.push(label);
    }    
    
  }

  removeLabel(label: any){
    let index;
    for (let i = 0; i < this.githubIssueForm.value.labels.length; i++) {
      if (this.githubIssueForm.value.labels[i] === label) {
        index = i;
        
      }
    }
    this.githubIssueForm.value.labels.splice(index,1);
  }


  onSubmit() {
    // make sure all is set
    console.log(this.githubIssueForm.value);

    // create http request

    // clear form and redirect to list page

  }
}
