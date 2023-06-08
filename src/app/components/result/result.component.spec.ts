import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ResultComponent } from './result.component';
import { DebugElement, Renderer2, Type } from '@angular/core';
import { By } from '@angular/platform-browser';
import { IOccurrence } from 'src/app/interface/shared.interface';

describe('ResultComponent', () => {

  let renderer2: Renderer2;

  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;
  let el: DebugElement;


  beforeEach(waitForAsync(() =>
    TestBed.configureTestingModule({
      declarations: [ResultComponent],
      providers: [Renderer2],
      imports: [],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ResultComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);

        fixture.detectChanges();
      })
  ));

  it('Should be created', () => {
    expect(component).toBeDefined();
  });

  it('generateRandomColor should work as expected', () => {
    const color: string = component.generateRandomColor(2);
    expect(color).toBe('orange');
  });

  it('Function addSpanToContainer should call renderer methods properly ', () => {
    const appendChildSpy = spyOn(renderer2, 'appendChild').and.callThrough();
    const setStyleSpy = spyOn(renderer2, 'setStyle').and.callThrough();

    const div = el.query(By.css('.result-container'));
    const innerText = 'dummy';
    let color = 'yellow';

    component.addSpanToContainer(div.nativeElement, innerText, color);
    expect(appendChildSpy).toHaveBeenCalledTimes(2);
    expect(appendChildSpy).toHaveBeenCalledTimes(2);
    expect(setStyleSpy).toHaveBeenCalledTimes(1);

  });

  it('Function addSpanToContainer should NOT call setStyleSpy methods', () => {
    const setStyleSpy = spyOn(renderer2, 'setStyle').and.callThrough();

    const div = el.query(By.css('.result-container'));
    const innerText = 'dummy';

    component.addSpanToContainer(div.nativeElement, innerText);
    expect(setStyleSpy).not.toHaveBeenCalled();

  });

  it('Function manageOverLaps should detect and manage overlaps properly', () => {

    const values: IOccurrence[] = [{
          "startIndex": 0,
          "endIndex": 4,
          "length": 4,
          "queryIndex": 0
      },
      {
          "startIndex": 1,
          "endIndex": 3,
          "length": 2,
          "queryIndex": 1
      }
    ];

    const expectedResult: IOccurrence[] = 
    [
      {
          "startIndex": 0,
          "endIndex": 1,
          "length": 1,
          "queryIndex": 0
      },
      {
          "startIndex": 1,
          "endIndex": 3,
          "length": 2,
          "queryIndex": 4
      },
      {
          "startIndex": 3,
          "endIndex": 4,
          "length": 1,
          "queryIndex": 1
      }
    ];

    const actualResult = component.manageOverLaps(values);
    expect(expectedResult).toEqual(actualResult);

  });




  // it('Should NOT show result when there is no matches', () => {

  //   component.form.controls['text'].setValue(`
  //   This is a test case
  //   For Vish interview
  //   This is a take
  //   home assignment`
  //   );
  //   component.form.controls['queries'].controls['query1'].setValue('no-over');
  //   component.form.controls['queries'].controls['query2'].setValue('-lap');
  //   component.form.controls['queries'].controls['query3'].setValue('no-over-lap');
  //   component.form.controls['mode'].setValue('online');

  //   fixture.detectChanges();
  //   const resultLines = el.queryAll(By.css('.result-container .result-container__line'));
  //   expect(resultLines.length).toBe(0);
  // });

  // it('Should show result when there is no overlap', () => {

  //   component.form.controls['text'].setValue(`
  //   This is a test case
  //   For Vish interview
  //   This is a take
  //   home assignment`
  //   );
  //   component.form.controls['queries'].controls['query1'].setValue('This');
  //   component.form.controls['queries'].controls['query2'].setValue('test');
  //   component.form.controls['queries'].controls['query3'].setValue('home');
  //   component.form.controls['mode'].setValue('online');

  //   fixture.detectChanges();
  //   const resultLines = el.queryAll(By.css('.result-container .result-container__line'));
  //   expect(resultLines.length).toBe(3);
  // });

  // it('Should show result when there IS overlap', () => {

  //   component.form.controls['text'].setValue(`
  //   This is a test case
  //   For Vish interview
  //   This is a take
  //   home assignment`
  //   );
  //   component.form.controls['queries'].controls['query1'].setValue('is a test');
  //   component.form.controls['queries'].controls['query2'].setValue('a t');
  //   component.form.controls['queries'].controls['query3'].setValue('assignment');
  //   component.form.controls['mode'].setValue('online');

  //   fixture.detectChanges();
  //   const resultLines = el.queryAll(By.css('.result-container .result-container__line'));
  //   expect(resultLines.length).toBe(3);
  //   const overlap = el.query(By.css('.result-container > div:nth-child(1) > span:nth-child(4)'));
  //   expect(overlap.nativeElement.textContent).toBe('a t');
  // });


  // it('Function findMatches should work as expected', () => {

  //   const text: string = 'This is a test case\nFor Vish interview\nThis is a take\nhome assignment';
  //   const queries = {
  //     query1: "case",
  //     query2: "Vish",
  //     query3: "home"
  //   };
  //   const mode = 'online';

  //   component.form.controls['text'].setValue(text);
  //   component.form.controls['queries'].controls['query1'].setValue(queries.query1);
  //   component.form.controls['queries'].controls['query2'].setValue(queries.query2);
  //   component.form.controls['queries'].controls['query3'].setValue(queries.query3);
  //   component.form.controls['mode'].setValue(mode);

  //   component.findMatches([[text, queries], mode]);

  //   expect(component.textLines).toEqual(['This is a test case', 'For Vish interview', 'This is a take', 'home assignment']);
  //   expect(component.resultMap.get(0)![0].endIndex).toBe(19);
  //   expect(component.resultMap.get(1)![0].startIndex).toBe(4);

  // });


  // it('Function onSearch should call findMatches', () => {

  //   const text: string = 'This is a test case';
  //   const queries = {
  //     query1: "is",
  //     query2: "te",
  //     query3: "se"
  //   };
  //   const mode = 'batch';

  //   const findMatchesSpy =  spyOn(component, 'findMatches').and.callThrough();
  
  //   component.form.controls['text'].setValue(text);
  //   component.form.controls['queries'].controls['query1'].setValue(queries.query1);
  //   component.form.controls['queries'].controls['query2'].setValue(queries.query2);
  //   component.form.controls['queries'].controls['query3'].setValue(queries.query3);
  //   component.form.controls['mode'].setValue(mode);

  //   component.onSearch();
  //   expect(findMatchesSpy).toHaveBeenCalledWith([[text, queries], mode]);
  // });


  // it('Function findMatches should NOT have been called via observables in batch mode', () => {

  //   const text: string = 'This is a test case';
  //   const queries = {
  //     query1: "is",
  //     query2: "te",
  //     query3: "se"
  //   };
  //   const mode = 'batch';

  //   const findMatchesSpy =  spyOn(component, 'findMatches').and.callThrough();
  
  //   component.form.controls['text'].setValue(text);
  //   component.form.controls['queries'].controls['query1'].setValue(queries.query1);
  //   component.form.controls['queries'].controls['query2'].setValue(queries.query2);
  //   component.form.controls['queries'].controls['query3'].setValue(queries.query3);
  //   component.form.controls['mode'].setValue(mode);

  //   expect(findMatchesSpy).not.toHaveBeenCalled();
  // });

});

