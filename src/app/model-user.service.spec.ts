import { TestBed, inject } from "@angular/core/testing";

import { ModelUserService } from "./model-user.service";

describe("ModelUserService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModelUserService]
    });
  });

  it("should be created", inject([ModelUserService], (service: ModelUserService) => {
    expect(service).toBeTruthy();
  }));
});
