import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GithubIssueService } from '../../service/github-issue.service';

@Component({
  selector: 'app-create',
  templateUrl: './create-issue.component.html',
  styleUrl: './create-issue.component.scss'
})
export class CreateIssueComponent implements OnInit{


  protected githubIssueForm!: FormGroup;

  constructor(protected githubService: GithubIssueService){
    this.githubIssueForm = new FormGroup({
      title: new FormControl('', Validators.required),
      body: new FormControl('', [Validators.required])
    });
    
  }

  ngOnInit(): void {
    
  }


  onSubmit() {
    // make sure all is set
    console.log(this.githubIssueForm.value);

    // create http request

    // clear form and redirect to list page

  }
}
