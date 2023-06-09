import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, combineLatestWith, filter } from 'rxjs';
import { IOccurrence } from 'src/app/interface/shared.interface';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(private fb: FormBuilder) {}

    resultMap = new Map<number, IOccurrence[]>();
    textLines: string[] = [];
    shouldShowSearchButton: boolean = false;

    form = this.fb.group({
        text:'',
        queries: this.fb.group({
            query1: '',
            query2: '',
            query3: '',
        }),
        mode: ''
    });

    ngOnInit(): void {
        const text$: Observable<string | null> = this.form.get('text')!.valueChanges;
        const queris$: Observable<any | null> = this.form.get('queries')!.valueChanges;
        const mode$: Observable<string | null> = this.form.get('mode')!.valueChanges;

        this.form.get('mode')!.valueChanges.subscribe(val => this.shouldShowSearchButton = val === 'batch'? true : false);

        text$.pipe(
            combineLatestWith(queris$),
            combineLatestWith(mode$),
            filter(([[], mode]) => mode === 'online'))
        .subscribe(this.findMatches.bind(this));
    }

    onSearch() {
        const text = this.form.controls.text.value;
        const queries = this.form.controls.queries.value;
        const mode = this.form.controls.mode.value;

        this.findMatches([[text, queries], mode]);
    }

    findMatches(combinedValue: any) {
        const [text, formQueries]: [string, any] = combinedValue[0];
        this.resultMap.clear();
        const queries: (string | null)[] = Object.values(formQueries);
        this.textLines = text?.split('\n')!;

        if(this.textLines?.length) {
            this.textLines?.forEach((line: string, lineIndex: number) => {
                Object.values(queries).forEach((query: string | null, queryIndex: number)=>{
                    if(query) {
                        const indices: number[] = this.getIndices(line, query);
                        indices.forEach((i: number) => {
                            if(i > -1) {
                                this.resultMap.has(lineIndex) ?
                                this.resultMap.get(lineIndex)!.push({startIndex: i, endIndex: i + query.length, length: query.length, queryIndex}) :
                                this.resultMap.set(lineIndex, [{startIndex: i, endIndex: i + query.length, length: query.length, queryIndex}]);
                            }
                        });
                    }
                });
            });
        }
    }

    getIndices(mainString: string, subString: string) {

        const subStringLength: number = subString.length;
        if (subStringLength == 0) {
            return [];
        }

        let startIndex = 0, index, indices = [];
        while ((index = mainString.indexOf(subString, startIndex)) > -1) {
            indices.push(index);
            startIndex = index + subStringLength;
        }
        return indices;
    }
}

