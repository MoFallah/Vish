import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { IOccurrence } from 'src/app/interface/shared.interface';

@Component({
  selector: 'vish-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent {

    constructor(private renderer: Renderer2) {}

    @ViewChild('result', { static: false }) resultContainer!: ElementRef<HTMLDivElement>;
    @Input() resultMap!: Map<number, IOccurrence[]>;

    @Input() set lines(lines: string[]) {
        this.resultContainer ? this.resultContainer.nativeElement.innerHTML = '' : null;
        
        for (let [key, values] of this.resultMap) {

            values.sort(this.sortOccurrence);

            const sentence: string = lines[key];
            const placeHolder: HTMLDivElement = this.renderer.createElement('div');
            this.renderer.setAttribute(placeHolder, 'class', 'result-container__line');
            const textBefore: string = sentence.slice(0, values[0].startIndex);
            this.addSpanToContainer(placeHolder, textBefore);

            const newValues: IOccurrence[] = [...this.manageOverLaps(values)];

            newValues.forEach( (occur: IOccurrence, index, valueArray) => {

                const highlitedText: string = sentence.slice(occur.startIndex, occur.startIndex + occur.length);

                let textAfter: string;
                if(index+1 < valueArray.length) {
                    textAfter = sentence.slice(occur.startIndex + occur.length, valueArray[index+1].startIndex);
                } else {
                    textAfter = sentence.slice(occur.startIndex + occur.length);
                }

                const randomColor = this.generateRandomColor(occur.queryIndex); 
                this.addSpanToContainer(placeHolder, highlitedText, randomColor);
                this.addSpanToContainer(placeHolder, textAfter);
            });

            this.renderer.appendChild(this.resultContainer.nativeElement, placeHolder);
        }
    }

    sortOccurrence(a: IOccurrence, b: IOccurrence) {
        if(a.startIndex === b.startIndex) {
            return a.endIndex - b.endIndex;
        }
        return (a.startIndex) - (b.startIndex);
    }

    generateRandomColor(index: number): string {
        return ['red', 'yellow', 'orange', 'green', 'grey', 'aqua', 'coral', 'cyan', 'lime', 'maroon', 'blue', 'brown'][index];
    }

    addSpanToContainer(placeHolder: HTMLDivElement, innerText: string, color?: string) {
        const span: HTMLSpanElement = this.renderer.createElement('span');
        color ? this.renderer.setStyle(span, 'background-color', color) : null;
        const text = this.renderer.createText(innerText);
        this.renderer.appendChild(span, text);
        this.renderer.appendChild(placeHolder, span);
    }

    manageOverLaps(values: IOccurrence[]): IOccurrence[]  {
        const newValues: IOccurrence[] = [];

        for(let index = 0; index < values.length; index++) {
            const value: IOccurrence = values[index]; 
            if(index+1 < values.length && value.endIndex > values[index+1].startIndex && value.endIndex <= values[index+1].endIndex) {

                const beforeOverlapOccurence: IOccurrence = {
                    startIndex: value.startIndex,
                    endIndex: values[index+1].startIndex,
                    length: values[index+1].startIndex - value.startIndex,
                    queryIndex: value.queryIndex
                };

                const overlapOccurence: IOccurrence = {
                    startIndex: values[index+1].startIndex,
                    endIndex: values[index].endIndex,
                    length: values[index].endIndex - values[index+1].startIndex,
                    queryIndex: value.queryIndex + 4
                };

                const afterOverlapOccurence: IOccurrence = {
                    startIndex: values[index].endIndex,
                    endIndex: values[index+1].endIndex,
                    length: values[index+1].endIndex - values[index].endIndex,
                    queryIndex: values[index+1].queryIndex

                };

                newValues.push(beforeOverlapOccurence);
                newValues.push(overlapOccurence);
                newValues.push(afterOverlapOccurence);
                index++;
                continue;
            }
            
            if(index+1 < values.length && value.endIndex > values[index+1].startIndex && value.endIndex > values[index+1].endIndex) {
                const beforeOverlapOccurence: IOccurrence = {
                    startIndex: value.startIndex,
                    endIndex: values[index+1].startIndex,
                    length: values[index+1].startIndex - value.startIndex,
                    queryIndex: value.queryIndex
                };

                const overlapOccurence: IOccurrence = {
                    startIndex: values[index+1].startIndex,
                    endIndex: values[index+1].endIndex,
                    length: values[index+1].endIndex - values[index+1].startIndex,
                    queryIndex: value.queryIndex + 4
                };

                const afterOverlapOccurence: IOccurrence = {
                    startIndex: values[index+1].endIndex,
                    endIndex: values[index].endIndex,
                    length: values[index].endIndex - values[index+1].endIndex,
                    queryIndex: values[index+1].queryIndex
                };

                newValues.push(beforeOverlapOccurence);
                newValues.push(overlapOccurence);
                newValues.push(afterOverlapOccurence);
                index++;
                continue;
            }
            
            if(index+1 < values.length && value.startIndex === values[index+1].startIndex) {

                const overlapOccurence: IOccurrence = value;

                const afterOverlapOccurence: IOccurrence = {
                    startIndex: value.endIndex,
                    endIndex: values[index+1].endIndex,
                    length: values[index+1].endIndex - value.endIndex,
                    queryIndex: values[index+1].queryIndex
                };

                newValues.push(overlapOccurence);
                newValues.push(afterOverlapOccurence);
                index++;
                continue;
            }
            newValues.push(value);
        };

        return newValues;
    }
}
