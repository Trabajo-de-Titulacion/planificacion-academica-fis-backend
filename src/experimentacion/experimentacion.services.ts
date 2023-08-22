import { Injectable } from "@nestjs/common";

@Injectable()
export class ExperimentacionService {

    getInfoAlejo(){
        return {name: "Ariel"}
    }

    getInfo(){
        return [
                { name: 'John', grade: 7 },
                { name: 'Jenny', grade: 5 },
                { name: 'Peter', grade: 4 },
                { name: 'Jessy', grade: 8 },
                { name: 'Bob', grade: 3 },
                { name: 'Sarah', grade: 6 },
                { name: 'Hannah', grade: 2 },
                { name: 'Paula', grade: 9 },
        ]
    }
}