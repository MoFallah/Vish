import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { DebugElement } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ResultComponent } from '../result/result.component';

describe('HomeComponent', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let el: DebugElement;


  beforeEach(waitForAsync(() =>
    TestBed.configureTestingModule({
      declarations: [HomeComponent, ResultComponent],
      providers: [FormBuilder],
      imports: [ReactiveFormsModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;

        fixture.detectChanges();

      })
  ));

  it('Should be created', () => {
    expect(component).toBeDefined();
  });

  it('Search button should be visible in batch mode', () => {
    component.form.controls['mode'].setValue('batch');
    fixture.detectChanges();
    const searchButton = el.query(By.css('.batch-search'));
    expect(searchButton).toBeTruthy();
  });

  it('Search button should NOT be visible in online mode', () => {
    component.form.controls['mode'].setValue('online');
    fixture.detectChanges();
    const searchButton = el.query(By.css('.batch-search'));
    expect(searchButton).toBeFalsy();
  });

  it('Should NOT show result when there is no matches', () => {

    component.form.controls['text'].setValue(`
    This is a test case
    For Vish interview
    This is a take
    home assignment`
    );
    component.form.controls['queries'].controls['query1'].setValue('no-over');
    component.form.controls['queries'].controls['query2'].setValue('-lap');
    component.form.controls['queries'].controls['query3'].setValue('no-over-lap');
    component.form.controls['mode'].setValue('online');

    fixture.detectChanges();
    const resultLines = el.queryAll(By.css('.result-container .result-container__line'));
    expect(resultLines.length).toBe(0);
  });

  it('Should show result when there is no overlap', () => {

    component.form.controls['text'].setValue(`
    This is a test case
    For Vish interview
    This is a take
    home assignment`
    );
    component.form.controls['queries'].controls['query1'].setValue('This');
    component.form.controls['queries'].controls['query2'].setValue('test');
    component.form.controls['queries'].controls['query3'].setValue('home');
    component.form.controls['mode'].setValue('online');

    fixture.detectChanges();
    const resultLines = el.queryAll(By.css('.result-container .result-container__line'));
    expect(resultLines.length).toBe(3);
  });

  it('Should show result when there IS overlap', () => {

    component.form.controls['text'].setValue(`
    This is a test case
    For Vish interview
    This is a take
    home assignment`
    );
    component.form.controls['queries'].controls['query1'].setValue('is a test');
    component.form.controls['queries'].controls['query2'].setValue('a t');
    component.form.controls['queries'].controls['query3'].setValue('assignment');
    component.form.controls['mode'].setValue('online');

    fixture.detectChanges();
    const resultLines = el.queryAll(By.css('.result-container .result-container__line'));
    expect(resultLines.length).toBe(3);
    const overlap = el.query(By.css('.result-container > div:nth-child(1) > span:nth-child(4)'));
    expect(overlap.nativeElement.textContent).toBe('a t');
  });


  it('Function findMatches should work as expected', () => {

    const text: string = 'This is a test case\nFor Vish interview\nThis is a take\nhome assignment';
    const queries = {
      query1: "case",
      query2: "Vish",
      query3: "home"
    };
    const mode = 'online';

    component.form.controls['text'].setValue(text);
    component.form.controls['queries'].controls['query1'].setValue(queries.query1);
    component.form.controls['queries'].controls['query2'].setValue(queries.query2);
    component.form.controls['queries'].controls['query3'].setValue(queries.query3);
    component.form.controls['mode'].setValue(mode);

    component.findMatches([[text, queries], mode]);

    expect(component.textLines).toEqual(['This is a test case', 'For Vish interview', 'This is a take', 'home assignment']);
    expect(component.resultMap.get(0)![0].endIndex).toBe(19);
    expect(component.resultMap.get(1)![0].startIndex).toBe(4);

  });


  it('Function onSearch should call findMatches', () => {

    const text: string = 'This is a test case';
    const queries = {
      query1: "is",
      query2: "te",
      query3: "se"
    };
    const mode = 'batch';

    const findMatchesSpy =  spyOn(component, 'findMatches').and.callThrough();
 
    component.form.controls['text'].setValue(text);
    component.form.controls['queries'].controls['query1'].setValue(queries.query1);
    component.form.controls['queries'].controls['query2'].setValue(queries.query2);
    component.form.controls['queries'].controls['query3'].setValue(queries.query3);
    component.form.controls['mode'].setValue(mode);

    component.onSearch();
    expect(findMatchesSpy).toHaveBeenCalledWith([[text, queries], mode]);
  });


  it('Function findMatches should NOT have been called via observables in batch mode', () => {

    const text: string = 'This is a test case';
    const queries = {
      query1: "is",
      query2: "te",
      query3: "se"
    };
    const mode = 'batch';

    const findMatchesSpy =  spyOn(component, 'findMatches').and.callThrough();
 
    component.form.controls['text'].setValue(text);
    component.form.controls['queries'].controls['query1'].setValue(queries.query1);
    component.form.controls['queries'].controls['query2'].setValue(queries.query2);
    component.form.controls['queries'].controls['query3'].setValue(queries.query3);
    component.form.controls['mode'].setValue(mode);

    expect(findMatchesSpy).not.toHaveBeenCalled();
  });


  it('Should show result when there are multiple indices in the main text', () => {

    component.form.controls['text'].setValue(`
    test case test case test case
    this is a test test test test
    multiple occurrences multiple occurrences multiple case`
    );
    component.form.controls['queries'].controls['query1'].setValue('case');
    component.form.controls['queries'].controls['query2'].setValue('test');
    component.form.controls['queries'].controls['query3'].setValue('multiple');
    component.form.controls['mode'].setValue('online');

    fixture.detectChanges();

    const caseOccurences = el.queryAll(By.css('span[style*="background-color: yellow"]'));
    expect(caseOccurences.length).toBe(7);

    const testOccurences = el.queryAll(By.css('span[style*="background-color: red"]'));
    expect(testOccurences.length).toBe(4);

    const multipleOccurences = el.queryAll(By.css('span[style*="background-color: orange"]'));
    expect(multipleOccurences.length).toBe(3);
  });


  it('Function getIndices should work as expected', () => {

    const mainString: string = 'This is a re-test to re-check getIndices function return result';
    const subString: string = 're';
    const expectedResult: number[] = [10, 21, 50, 57]

    const actualResult: number[] = component.getIndices(mainString, subString);

    expect(actualResult).toEqual(expectedResult);
  });

});


