import {TestBed, inject} from "@angular/core/testing";

import {BagitModelService} from "./bagit-model.service";


describe("BagitModelService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({providers: [BagitModelService]});
    });

    it("should be created",
       inject([BagitModelService], (service: BagitModelService) => {
           expect(service).toBeTruthy();
       }));
});
