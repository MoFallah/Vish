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

});

