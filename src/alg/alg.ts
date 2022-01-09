import * as readline from "readline";
import { type } from "os";
import { cp } from "fs";
import { get } from "http";
import { Direction } from "../utils/dir_utils";
export const a = "a";

interface carInfo {
  id: number;
  roadDir: Direction;
  roadId: number;
  idOnRoad: number;
  zones: { col: number; row: number }[];
  outroadDir: Direction;
}
interface vertex {
  id: number;
  zone_id: number;
}
interface edge {
  type: number;
  in: vertex;
  out: vertex;
}
interface vertexWithEdge {
  id: number;
  zone_id: number;
  edges: edge[];
  nextElement: vertex;
  deletestage: number;
  // roadId: number
}
interface type3edge {
  valid:boolean;
  endpoint: vertex[];
}
interface GraphVertex {
  id: number;
  front: number;
  end: number;
  edges: GraphVertex[];
}

interface normalvertex {
  id: number;
  edge: normalvertex[];
  visited: boolean;
  recstack: boolean;
}

interface roadcar{
  id:number;
  idOnRaod:number;
}

interface carConflictOrder{
  id:number;
  order:number;
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function isCycleutil(cur: number, v: normalvertex[]): boolean {
  if (v[cur].visited == false) {
    v[cur].visited = true;
    v[cur].recstack = true;
    for (let i = 0; i < v[cur].edge.length; i++) {
      if (!v[cur].edge[i].visited && isCycleutil(v[cur].edge[i].id, v))
        return true;
      else if (v[cur].edge[i].recstack) {
        return true;
      }
    }
  }
  v[cur].recstack = false;
  return false;
}

function isCycle(gv: GraphVertex[]): boolean {
  let v: normalvertex[] = [];

  for (let i = 0; i < gv.length; i++)
    v.push({ id: i, edge: [], visited: false, recstack: false });
  for (let i = 0; i < gv.length; i++) {
    for (let j = 0; j < gv[i].edges.length; j++) {
      for (let k = 0; k < gv.length; k++) {
        if (i == k) continue;
        if (gv[i].edges[j] == gv[k]) v[i].edge.push(v[k]);
      }
    }
  }

  for (let i = 0; i < v.length; i++) {
    if (isCycleutil(i, v)) {
      return true;
    }
  }
  return false;
}

function isDeadLock(vertexs: vertexWithEdge[], edges: edge[]): boolean {
  let gv: GraphVertex[] = [];

  for (let i = 1; i < vertexs.length; i++) {
    if (vertexs[i - 1].id == vertexs[i].id) {
      gv.push({
        id: vertexs[i].id,
        front: vertexs[i - 1].zone_id,
        end: vertexs[i].zone_id,
        edges: [],
      });
    }
  }
  for(let i = 0;i < vertexs.length;i++){
    if(i == 0){
      if(i + 1 < vertexs.length && vertexs[i].id != vertexs[i + 1].id){
        gv.push({
          id: vertexs[i].id,
          front: vertexs[i].zone_id,
          end: vertexs[i].zone_id,
          edges: [],
        })
      }
    }else if(i == vertexs.length - 1){
      if(vertexs[i].id != vertexs[i - 1].id){
        gv.push({
          id: vertexs[i].id,
          front: vertexs[i].zone_id,
          end: vertexs[i].zone_id,
          edges: [],
        })
      }
    }else if(vertexs[i].id != vertexs[i - 1].id && vertexs[i].id != vertexs[i + 1].id){
      gv.push({
        id: vertexs[i].id,
        front: vertexs[i].zone_id,
        end: vertexs[i].zone_id,
        edges: [],
      })
    }
  }

  for (let i = 0; i < vertexs.length; i++) {
    for (let l = 0; l < gv.length; l++) {
      if (
        vertexs[i].id == gv[l].id &&
        (vertexs[i].zone_id == gv[l].end || vertexs[i].zone_id == gv[l].front)
      ) {
        for (let j = 0; j < vertexs[i].edges.length; j++) {
          for (let k = 0; k < gv.length; k++) {
            if (k == l) continue;
            if (
              vertexs[i].edges[j].out.id == gv[k].id &&
              (vertexs[i].edges[j].out.zone_id == gv[k].end ||
                vertexs[i].edges[j].out.zone_id == gv[k].front)
            ) {
              let a = 0;
              for (let m = 0; m < gv[l].edges.length; m++) {
                if (gv[k] == gv[l].edges[m]) a = 1;
              }
              if (a != 1) gv[l].edges.push(gv[k]);
            }
          }
        }
      }
    }
  }
  // console.log(gv);
  for (let i = 0; i < edges.length; i++) {
    for (let j = 0; j < gv.length; j++) {
      if (
        edges[i].in.id == gv[j].id &&
        (edges[i].in.zone_id == gv[j].front || edges[i].in.zone_id == gv[j].end)
      ) {
        for (let k = 0; k < gv.length; k++) {
          if (
            edges[i].out.id == gv[k].id &&
            (edges[i].out.zone_id == gv[k].front ||
              edges[i].out.zone_id == gv[k].end)
          ) {
            let b: number = 1;
            for (let m = 0; m < gv[j].edges.length; m++)
              if (gv[k] == gv[j].edges[m]) b = 0;
            if (b == 1) gv[j].edges.push(gv[k]);
          }
        }
      }
    }
  }
  // console.log(gv);
  return isCycle(gv);
}

function getDir(
  z1: number,
  z2: number,
  z3: number,
  car: carInfo,
  col: number
): action {
  if (z1 == -1) {
    switch (car.roadDir) {
      case "top":
        z1 = z2 - col;
        break;
      case "right":
        z1 = z2 + 1;
        break;
      case "left":
        z1 = z2 - 1;
        break;
      case "bot":
        z1 = z2 + col;
        break;
    }
  }
  if (z3 == -1) {
    switch (car.outroadDir) {
      case "top":
        z3 = z2 - col;
        break;
      case "right":
        z3 = z2 + 1;
        break;
      case "left":
        z3 = z2 - 1;
        break;
      case "bot":
        z3 = z2 + col;
        break;
    }
  }

  switch (z2 - z1) {
    case 1: // to right
      switch (z3 - z2) {
        case 1:
          return "foward";
        case -1:
          return "nonsense";
        case col:
          return "right";
        case -col:
          return "left";
      }
      break;
    case -1: // to left
      switch (z3 - z2) {
        case 1:
          return "nonsense";
        case -1:
          return "foward";
        case col:
          return "left";
        case -col:
          return "right";
      }
      break;
    case col: // to bot
      switch (z3 - z2) {
        case 1:
          return "left";
        case -1:
          return "right";
        case col:
          return "foward";
        case -col:
          return "nonsense";
      }
      break;
    case -col: // to top
      switch (z3 - z2) {
        case 1:
          return "right";
        case -1:
          return "left";
        case col:
          return "nonsense";
        case -col:
          return "foward";
      }
      break;
  }
  return "nonsense";
}

function RandomApproach(removedtype3edge:edge[],type3edges:type3edge[]):void{
  for (let i = 0; i < type3edges.length; i++) {
    let rand = getRandomInt(2);
    removedtype3edge.push({
      type: 3,
      in: type3edges[i].endpoint[rand],
      out: type3edges[i].endpoint[1 - rand],
    });
  }
}

function Type2remove(firstcar:vertex,waitcar:vertex,removedtype3edge:edge[],type3edges:type3edge[],cars:carInfo[],CarRoadMap:Map<number,roadcar[]>
  ,CarpastCarsMap:Map<number,number[]>):void{

      let waitcardIdonRoad:number|undefined = cars.find(ele=>ele.id == waitcar.id)?.idOnRoad;
      let CarOnSameRoadw = CarRoadMap.get(waitcar.id);
      if(CarOnSameRoadw){
        CarOnSameRoadw.forEach(element=>{
          // @ts-ignore
          if(element.idOnRaod > waitcardIdonRoad){
            let tmpv:vertex = {id:element.id,zone_id:firstcar.zone_id};
            type3edges.forEach(ele=>{
              if(ele.valid){  
                if(ele.endpoint[0].id == tmpv.id && ele.endpoint[0].zone_id == tmpv.zone_id &&
                  ele.endpoint[1].id == firstcar.id && ele.endpoint[1].zone_id == firstcar.zone_id){  
                    removedtype3edge.push({type:3,in:firstcar,out:tmpv});
                    if(CarpastCarsMap.get(firstcar.id)?.find(ele=>ele == tmpv.id) == undefined)
                      CarpastCarsMap.get(firstcar.id)?.push(tmpv.id);
                    ele.valid = false;
                }else if(ele.endpoint[1].id == tmpv.id && ele.endpoint[1].zone_id == tmpv.zone_id &&
                  ele.endpoint[0].id == firstcar.id && ele.endpoint[0].zone_id == firstcar.zone_id){
                    removedtype3edge.push({type:3,in:firstcar,out:tmpv});
                    if(CarpastCarsMap.get(firstcar.id)?.find(ele=>ele == tmpv.id) == undefined)
                      CarpastCarsMap.get(firstcar.id)?.push(tmpv.id);
                    ele.valid = false;
                  }
                } 
            });
        }
        });
      }

      let firstcarIdonRoad:number|undefined = cars.find(ele=>ele.id == firstcar.id)?.idOnRoad;
      let CarOnSameRoadf = CarRoadMap.get(firstcar.id);
      if(CarOnSameRoadf){
        CarOnSameRoadf.forEach(element=>{
          // @ts-ignore
          if(element.idOnRaod < firstcarIdonRoad){
            let tmpv:vertex = {id:element.id,zone_id:waitcar.zone_id};
            type3edges.forEach(ele=>{
              if(ele.valid){  
                if(ele.endpoint[0].id == tmpv.id && ele.endpoint[0].zone_id == tmpv.zone_id &&
                  ele.endpoint[1].id == waitcar.id && ele.endpoint[1].zone_id == waitcar.zone_id){
                    removedtype3edge.push({type:3,in:tmpv,out:waitcar});
                    if(CarpastCarsMap.get(tmpv.id)?.find(ele=>ele == waitcar.id) != undefined)CarpastCarsMap.get(tmpv.id)?.push(waitcar.id);
                    ele.valid = false;
                }else if(ele.endpoint[1].id == tmpv.id && ele.endpoint[1].zone_id == tmpv.zone_id &&
                  ele.endpoint[0].id == waitcar.id && ele.endpoint[0].zone_id == waitcar.zone_id){
                    removedtype3edge.push({type:3,in:tmpv,out:waitcar});
                    if(CarpastCarsMap.get(tmpv.id)?.find(ele=>ele == waitcar.id) != undefined)CarpastCarsMap.get(tmpv.id)?.push(waitcar.id);
                    ele.valid = false;
                  }
                } 
            });
          }
        })
      }
}

function Type2Approach(removedtype3edge:edge[],type3edges:type3edge[],cars:carInfo[],CarRoadMap:Map<number,roadcar[]>):void{
  let CarpastCarsMap = new Map<number,number[]>();
  for (let i = 0; i < type3edges.length; i++) {
    if(type3edges[i].valid){
      let rand = getRandomInt(2);
      removedtype3edge.push({
        type: 3,
        in: type3edges[i].endpoint[rand],
        out: type3edges[i].endpoint[1 - rand],
      });
      type3edges[i].valid = false;
      Type2remove(type3edges[i].endpoint[rand],type3edges[i].endpoint[1-rand],removedtype3edge,type3edges,cars,CarRoadMap,CarpastCarsMap);
    }
  }
  type3edges.forEach(ele=>ele.valid = true);
}

function recursvieFindPast(CarpastCarsMap:Map<number,number[]>,target:number,currentId:number,existID:number[]):boolean{
  let pastCars = CarpastCarsMap.get(currentId);
  let IfFind:boolean = false;
  if(pastCars){
    for(let i = 0;i < pastCars.length;i++){
      let ele = pastCars[i];
      if(ele == target){
        return true;
      }
      if(existID.find(element=>element == ele) == undefined){
        existID.push(ele);
        // console.log(ele,recursvieFindPast(CarpastCarsMap,target,ele,existID));
        IfFind =  IfFind || recursvieFindPast(CarpastCarsMap,target,ele,existID);
      }
    }
  }
  // console.log(IfFind);
  if(IfFind)
    return true;
  return false;
}



function FindCarPrevilege(car0:number,car1:number,CarpastCarsMap:Map<number,number[]>):number{
  

  if(recursvieFindPast(CarpastCarsMap,car1,car0,[])){
    return 0;
  }

  if(recursvieFindPast(CarpastCarsMap,car0,car1,[])){
    return 1;
  }


  return -1;
}

function ConsideALLConflictZoneApproach(removedtype3edge:edge[],type3edges:type3edge[],cars:carInfo[],
  CarRoadMap:Map<number,roadcar[]>,CarZoneOrderMap:Map<number,Map<number,number>>):void{
  
  let CarpastCarsMap = new Map<number,number[]>();

  for(let i = 0;i < cars.length;i++){
    CarpastCarsMap.set(cars[i].id,[]);
  }
  
  for(let i = 0;i < cars.length;i++){
    let p = CarpastCarsMap.get(cars[i].id);
    let CarsOnsameRoad = CarRoadMap.get(cars[i].id);
    CarsOnsameRoad?.forEach(ele=>{
      if(ele.idOnRaod > cars[i].idOnRoad){
        p?.push(ele.id);  
      }
    })
  }
  // console.log(CarpastCarsMap);
  // console.log(CarwaitCarsMap);
  
  
  for (let i = 0; i < type3edges.length; i++) {
    if(type3edges[i].valid){
      let Incar:number = FindCarPrevilege(type3edges[i].endpoint[0].id,type3edges[i].endpoint[1].id,CarpastCarsMap);
      if(Incar == -1){
        // Incar = getRandomInt(2);
        // @ts-ignore
        if(CarZoneOrderMap.get(type3edges[i].endpoint[0].id)?.get(type3edges[i].endpoint[0].zone_id) < CarZoneOrderMap.get(type3edges[i].endpoint[1].id)?.get(type3edges[i].endpoint[1].zone_id)){
          Incar = 0;
        }else{
          Incar = 1;
        }
      }
      removedtype3edge.push({
        type: 3,
        in: type3edges[i].endpoint[Incar],
        out: type3edges[i].endpoint[1 - Incar],
      });
      type3edges[i].valid = false;
      Type2remove(type3edges[i].endpoint[Incar],type3edges[i].endpoint[1-Incar],removedtype3edge,type3edges,cars,CarRoadMap,CarpastCarsMap);
      let firstcarId:number = type3edges[i].endpoint[Incar].id;
      let waitcarId:number = type3edges[i].endpoint[1 - Incar].id;

      if(CarpastCarsMap.get(firstcarId)?.find(ele=>ele == waitcarId) == undefined)CarpastCarsMap.get(firstcarId)?.push(waitcarId);

      // type3edges.forEach(ele=>{
      //   if(ele.valid && ele.endpoint[0].id == firstcarId && ele.endpoint[1].id == waitcarId){
      //     removedtype3edge.push({
      //       type: 3,
      //       in: ele.endpoint[0],
      //       out: ele.endpoint[1],
      //     });
      //     ele.valid = false;
      //     Type2remove(ele.endpoint[0],ele.endpoint[1],removedtype3edge,type3edges,cars,CarRoadMap,CarpastCarsMap);
      //   }else if(ele.valid && ele.endpoint[1].id == firstcarId && ele.endpoint[0].id == waitcarId){
      //     removedtype3edge.push({
      //       type: 3,
      //       in: ele.endpoint[1],
      //       out: ele.endpoint[0],
      //     });
      //     ele.valid = false;
      //     Type2remove(ele.endpoint[1],ele.endpoint[0],removedtype3edge,type3edges,cars,CarRoadMap,CarpastCarsMap);
      //   }
      // });
    }
  }
  type3edges.forEach(ele=>ele.valid = true);
}

function Type2removeBetter(firstcar:vertex,waitcar:vertex,removedtype3edge:edge[],type3edges:type3edge[],cars:carInfo[],CarRoadMap:Map<number,roadcar[]>
  ,CarpastCarsMap:Map<number,carConflictOrder[]>):void{

      let waitcardIdonRoad:number|undefined = cars.find(ele=>ele.id == waitcar.id)?.idOnRoad;
      let CarOnSameRoadw = CarRoadMap.get(waitcar.id);
      if(CarOnSameRoadw){
        CarOnSameRoadw.forEach(element=>{
          // @ts-ignore
          if(element.idOnRaod > waitcardIdonRoad){
            let tmpv:vertex = {id:element.id,zone_id:firstcar.zone_id};
            type3edges.forEach(ele=>{
              if(ele.valid){  
                if(ele.endpoint[0].id == tmpv.id && ele.endpoint[0].zone_id == tmpv.zone_id &&
                  ele.endpoint[1].id == firstcar.id && ele.endpoint[1].zone_id == firstcar.zone_id){  
                    removedtype3edge.push({type:3,in:firstcar,out:tmpv});
                    CarpastCarsMap.get(firstcar.id)?.push({id:tmpv.id,order:tmpv.zone_id});
                    ele.valid = false;
                }else if(ele.endpoint[1].id == tmpv.id && ele.endpoint[1].zone_id == tmpv.zone_id &&
                  ele.endpoint[0].id == firstcar.id && ele.endpoint[0].zone_id == firstcar.zone_id){
                    removedtype3edge.push({type:3,in:firstcar,out:tmpv});
                    CarpastCarsMap.get(firstcar.id)?.push({id:tmpv.id,order:tmpv.zone_id});
                    ele.valid = false;
                  }
                } 
            });
        }
        });
      }

      let firstcarIdonRoad:number|undefined = cars.find(ele=>ele.id == firstcar.id)?.idOnRoad;
      let CarOnSameRoadf = CarRoadMap.get(firstcar.id);
      if(CarOnSameRoadf){
        CarOnSameRoadf.forEach(element=>{
          // @ts-ignore
          if(element.idOnRaod < firstcarIdonRoad){
            let tmpv:vertex = {id:element.id,zone_id:waitcar.zone_id};
            type3edges.forEach(ele=>{
              if(ele.valid){  
                if(ele.endpoint[0].id == tmpv.id && ele.endpoint[0].zone_id == tmpv.zone_id &&
                  ele.endpoint[1].id == waitcar.id && ele.endpoint[1].zone_id == waitcar.zone_id){
                    removedtype3edge.push({type:3,in:tmpv,out:waitcar});
                    CarpastCarsMap.get(tmpv.id)?.push({id:waitcar.id,order:tmpv.zone_id});
                    ele.valid = false;
                }else if(ele.endpoint[1].id == tmpv.id && ele.endpoint[1].zone_id == tmpv.zone_id &&
                  ele.endpoint[0].id == waitcar.id && ele.endpoint[0].zone_id == waitcar.zone_id){
                    removedtype3edge.push({type:3,in:tmpv,out:waitcar});
                    CarpastCarsMap.get(tmpv.id)?.push({id:waitcar.id,order:tmpv.zone_id});
                    ele.valid = false;
                  }
                } 
            });
          }
        })
      }
}


function recursvieFindPastBetter(CarpastCarsMap:Map<number,carConflictOrder[]>,target:carConflictOrder,currentId:number,existID:number[],cnt:number):boolean{
  let pastCars = CarpastCarsMap.get(currentId);
  let IfFind:boolean = false;
  if(pastCars){
    for(let i = 0;i < pastCars.length;i++){
      let ele = pastCars[i];
      if(ele.id == target.id && ele.order - cnt <= target.order){
        return true;
      }
      if(existID.find(element=>element == ele.id) == undefined){
        existID.push(ele.id);
        // console.log(ele,recursvieFindPast(CarpastCarsMap,target,ele,existID));
        IfFind =  IfFind || recursvieFindPastBetter(CarpastCarsMap,target,ele.id,existID,cnt);
      }
    }
  }
  // console.log(IfFind);
  if(IfFind)
    return true;
  return false;
}



function FindCarPrevilegeBetter(car0:carConflictOrder,car1:carConflictOrder,CarpastCarsMap:Map<number,carConflictOrder[]>,cnt:number):number{

  if(recursvieFindPastBetter(CarpastCarsMap,car1,car0.id,[],cnt)){
    return 0;
  }

  if(recursvieFindPastBetter(CarpastCarsMap,car0,car1.id,[],cnt)){
    return 1;
  }

  return -1;
}


function BetterApproach(removedtype3edge:edge[],type3edges:type3edge[],cars:carInfo[],
  CarRoadMap:Map<number,roadcar[]>,CarZoneOrderMap:Map<number,Map<number,number>>,cnt:number):void{
  
  let CarpastCarsMap = new Map<number,carConflictOrder[]>();

  for(let i = 0;i < cars.length;i++){
    CarpastCarsMap.set(cars[i].id,[]);
  }
  
  for(let i = 0;i < cars.length;i++){
    let p = CarpastCarsMap.get(cars[i].id);
    let CarsOnsameRoad = CarRoadMap.get(cars[i].id);
    CarsOnsameRoad?.forEach(ele=>{
      if(ele.idOnRaod > cars[i].idOnRoad){
        p?.push({id:ele.id,order:-1});  
      }
    })
  }
  
  for (let i = 0; i < type3edges.length; i++) {
    if(type3edges[i].valid){
      let car0Order = CarZoneOrderMap.get(type3edges[i].endpoint[0].id)?.get(type3edges[i].endpoint[0].zone_id);
      let car1Order = CarZoneOrderMap.get(type3edges[i].endpoint[1].id)?.get(type3edges[i].endpoint[1].zone_id);
      // @ts-ignore
      let Incar:number = FindCarPrevilegeBetter({id:type3edges[i].endpoint[0].id,order:car0Order},{id:type3edges[i].endpoint[1].id,order:car1Order},CarpastCarsMap,cnt);

      if(Incar == -1){
        // Incar = getRandomInt(2);
        let car0ConflictLength = cars.find(ele=>ele.id == type3edges[i].endpoint[0].id)?.zones.length;
        let car1ConflictLength = cars.find(ele=>ele.id == type3edges[i].endpoint[1].id)?.zones.length;
        // @ts-ignore
        if(car0Order < car1Order){
          Incar = 0;
        }else{
          Incar = 1;
        }
      }
      removedtype3edge.push({
        type: 3,
        in: type3edges[i].endpoint[Incar],
        out: type3edges[i].endpoint[1 - Incar],
      });

      type3edges[i].valid = false;
      Type2removeBetter(type3edges[i].endpoint[Incar],type3edges[i].endpoint[1-Incar],removedtype3edge,type3edges,cars,CarRoadMap,CarpastCarsMap);
      let firstcarId:number = type3edges[i].endpoint[Incar].id;
      let waitcarId:number = type3edges[i].endpoint[1 - Incar].id;

      // @ts-ignore
      CarpastCarsMap.get(firstcarId)?.push({id:waitcarId,order:CarZoneOrderMap.get(waitcarId)?.get(type3edges[i].endpoint[0].zone_id)});

      // console.log(CarpastCarsMap);
    }
  }
  // console.log(removedtype3edge);
  type3edges.forEach(ele=>ele.valid = true);
}





type action = "right" | "foward" | "stop" | "left" | "nonsense";

export function getTimeMap(
  cars: carInfo[],
  numofcol: number,
  numofrow: number
): Map<number, action[]>|undefined {
  // console.log(cars);
  let CarRoadMap = new Map<number, roadcar[]>();
  let CarZoneOrderMap = new Map<number,Map<number,number>>();
  
  for (let i = 0; i < cars.length; i++) {
    CarRoadMap.set(cars[i].id, []);
    for (let j = 0; j < cars.length; j++) {
      if (i == j) continue;
      if (
        cars[i].roadDir == cars[j].roadDir &&
        cars[i].roadId == cars[j].roadId
      ) {
        CarRoadMap.get(cars[i].id)?.push({id:cars[j].id,idOnRaod:cars[j].idOnRoad});
      }
    }
  }

  let zoneId_cardIdMap: carInfo[][] = [[]];
  let vertexs: vertex[] = [];
  let total_zone = numofcol * numofrow;
  let edges: edge[] = [];
  let type3edges: type3edge[] = [];
  let ve: vertexWithEdge[] = [];

  for (let i = 0; i < total_zone; i++) zoneId_cardIdMap[i] = [];
  let num = 0;
  for (let i = 0; i < cars.length; i++){
    let emptyMap = new Map<number,number>();
    CarZoneOrderMap.set(cars[i].id,emptyMap);
    for (let j = 0; j < cars[i].zones.length; j++) {
      let zoneId: number =
        numofcol * cars[i].zones[j].row + cars[i].zones[j].col;
      CarZoneOrderMap.get(cars[i].id)?.set(zoneId,j);
      let nextzoneId: number = -1;
      if (j != cars[i].zones.length - 1) {
        nextzoneId =
          numofcol * cars[i].zones[j + 1].row + cars[i].zones[j + 1].col;
      } else {
        nextzoneId = numofcol * cars[i].zones[j].row + cars[i].zones[j].col;
      }
      zoneId_cardIdMap[zoneId].push(cars[i]);
      ve.push({
        id: cars[i].id,
        zone_id: zoneId,
        edges: [],
        nextElement: { id: cars[i].id, zone_id: nextzoneId },
        deletestage: 0,
      });

      if (j != 0) {
        ve[num - 1].edges.push({
          type: 1,
          in: { id: cars[i].id, zone_id: ve[num - 1].zone_id },
          out: { id: cars[i].id, zone_id: zoneId },
        });
        //edges.push({type:1,in:{id:cars[i].id,zone_id:vertexs[num - 1].zone_id},out:{id:cars[i].id,zone_id:zoneId}});
      }
      num++;
    }
  }

  for (let i = 0; i < total_zone; i++) {
    for (let j = 0; j < zoneId_cardIdMap[i].length; j++) {
      for (let k = j + 1; k < zoneId_cardIdMap[i].length; k++) {
        if (
          zoneId_cardIdMap[i][j].roadDir == zoneId_cardIdMap[i][k].roadDir &&
          zoneId_cardIdMap[i][j].roadId == zoneId_cardIdMap[i][k].roadId
        ) {
          if (
            zoneId_cardIdMap[i][j].idOnRoad < zoneId_cardIdMap[i][k].idOnRoad
          ) {
            let v = 0;
            for (let m = 0; m < ve.length; m++)
              if (ve[m].id == zoneId_cardIdMap[i][j].id && ve[m].zone_id == i) {
                ve[m].edges.push({
                  type: 2,
                  in: { id: zoneId_cardIdMap[i][j].id, zone_id: i },
                  out: { id: zoneId_cardIdMap[i][k].id, zone_id: i },
                });
                break;
              }
            //edges.push({type:2,in:{id:zoneId_cardIdMap[i][j].id,zone_id:i},out:{id:zoneId_cardIdMap[i][k].id,zone_id:i}});
          }
        } else {
          type3edges.push({
            valid:true,
            endpoint: [
              { id: zoneId_cardIdMap[i][j].id, zone_id: i },
              { id: zoneId_cardIdMap[i][k].id, zone_id: i },
            ],
          });
        }
      }
    }
  }

  let n: number = 0; ///////debug use
  let successType3Edge: edge[] = [];


  
  console.log('number of type3 edge = ',type3edges.length);
 
  let approach:number = 3;
  // console.log(approach);
  let cnt = 0;
  while (true) {
    let removedtype3edge: edge[] = [];

    // select type3 edge approach
    switch(approach){
      case 0:
        RandomApproach(removedtype3edge,type3edges);
        break;
      case 1:
        Type2Approach(removedtype3edge,type3edges,cars,CarRoadMap);
        break;
      case 2:
        ConsideALLConflictZoneApproach(removedtype3edge,type3edges,cars,CarRoadMap,CarZoneOrderMap);
        break;
      case 3:
        BetterApproach(removedtype3edge,type3edges,cars,CarRoadMap,CarZoneOrderMap,cnt);
        cnt++;
        break;
          
    }
    
    // let fake = new Map<number,action[]>();
    // return fake;

    n++;
    if (n == 1000000){
      console.log('404 NOT FOUND');
      let fake = new Map<number,action[]>();
      return fake;
    }
    if (!isDeadLock(ve, removedtype3edge)) {
      successType3Edge = removedtype3edge;
      console.log('number of time = ',n);
      // console.log(removedtype3edge);
      break;
    }
  }

  
  //add type3Edge to vertex
  for (let i = 0; i < successType3Edge.length; i++) {
    ve.find(
      (element) =>
        element.id == successType3Edge[i].in.id &&
        element.zone_id == successType3Edge[i].in.zone_id
    )?.edges.push(successType3Edge[i]);
  }


  let timeMap = new Map<number, number[]>();
  for (let i = 0; i < cars.length; i++)
    timeMap.set(cars[i].id, [-cars[i].idOnRoad - 1]);

  let CarIdOnRoad = new Map<number, number>();
  for (let i = 0; i < cars.length; i++)
    CarIdOnRoad.set(cars[i].id, cars[i].idOnRoad);

  let time: number = 2;

  // console.log(successType3Edge);
  while (ve.length > 0) {
    if(time > 5000){
      console.log('what is happened');
      let fake = new Map<number,action[]>();
      return fake;
    }
    for (let i = 0; i < ve.length; i++) {
      if(ve[i].deletestage == 2)
        continue;
      if (
        !ve.find((element) =>
          element.edges.find(
            (ele) => ele.out.id == ve[i].id && ele.out.zone_id == ve[i].zone_id
          )
        )
      ) {
        timeMap.get(ve[i].id)?.push(ve[i].zone_id);
        ve[i].deletestage = 1;
      } else {
        let timeMovement = timeMap.get(ve[i].id);
        if (timeMovement && timeMovement.length < time)
          timeMovement?.push(timeMovement[timeMovement.length - 1]);
      }
    }


    for (let i = 0; i < ve.length; i++) {
      if (ve[i].deletestage == 1) {

        if (CarIdOnRoad.get(ve[i].id) == 0) {
          let carOnsameRoad: roadcar[] | undefined = CarRoadMap.get(ve[i].id);
          if (carOnsameRoad) {
            for (let j = 0; j < carOnsameRoad?.length; j++) {
              // @ts-ignore
              if (CarIdOnRoad.get(carOnsameRoad[j].id) < 0) {
                continue;
              }
              let timeMovement = timeMap.get(carOnsameRoad[j].id);
              // @ts-ignore
              timeMovement[timeMovement.length - 1]++;
              let idroad = CarIdOnRoad.get(carOnsameRoad[j].id);
              // @ts-ignore
              CarIdOnRoad.set(carOnsameRoad[j].id, idroad - 1);
            }
          }
          CarIdOnRoad.set(ve[i].id, -1);
        }
        
        ve[i].deletestage = 2;
        let index = ve[i].edges.findIndex(
          (element) => element.out.id == element.in.id
        );
        if (index != -1) {
          ve[i].edges.splice(index, 1);
        }
        let tmpv:vertex = {id:ve[i].id,zone_id:ve[i].zone_id};
        let ifDelete:boolean = false;

        if (
          !ve.find((element) =>
            element.edges.find(
              (ele) => ele.out.id == ve[i].nextElement.id && ele.out.zone_id == ve[i].nextElement.zone_id
            )
          )
        ){
          ifDelete = true; /////something I add 
        }

        if(ve[i].nextElement.zone_id == ve[i].zone_id || ifDelete){
          ve.splice(i,1);
        }

        let deleteIndex = ve.findIndex(
          (element) =>
            element.nextElement.id == tmpv.id &&
            element.nextElement.zone_id == tmpv.zone_id &&
            element.deletestage == 2
        );

        if (deleteIndex != -1) {
          ve.splice(deleteIndex, 1);
        }
        
        i = -1;
      }
    }

    time++;
  }
 

  let timeDirectionMap = new Map<number, action[]>();

  for (let i = 0; i < cars.length; i++) {
    let timeDirection: action[] = [];
    let timeConflictZone = timeMap.get(cars[i].id);
    if (timeConflictZone) {
      let counter: number = 0;
      let z1: number = -1,
        z2: number = -2,
        z3: number = -2;
      for (let j = 0; j < timeConflictZone?.length - 1; j++) {
        if (timeConflictZone[j] < -1) {
          if (timeConflictZone[j + 1] > timeConflictZone[j])
            timeDirection.push("foward");
          else timeDirection.push("stop");
        } else {
          if (timeConflictZone[j + 1] == -1) {
            timeDirection.push("stop");
            continue;
          }
          if (z2 == -2) {
            z2 = timeConflictZone[j + 1];
          }
          if (j == timeConflictZone.length - 2) {
            z3 = -1;
          } else z3 = timeConflictZone[j + 2];

          if (z2 == z3) {
            counter++;
          } else {
            let dir: action = getDir(z1, z2, z3, cars[i], numofcol);
            timeDirection.push(dir);
            for (let k = 0; k < counter; k++) timeDirection.push("stop");
            z1 = z2;
            z2 = z3;
            counter = 0;
          }
        }
      }
    }
    timeDirection.push("foward");
    timeDirectionMap.set(cars[i].id, timeDirection);
  }
  // console.log(timeDirectionMap);
  return timeDirectionMap;
}


// let cars: carInfo[] = []; /// input
// let numofcol: number = 3; /// input
// let numofrow: number = 3; /// input

// let car: carInfo = {
//   id: 0,
//   roadDir: "left",
//   roadId: 1,
//   idOnRoad: 0,
//   zones: [
//     { col: 0, row: 0 },
//     { col: 1, row: 0 },
//     { col: 2, row: 0 },
//   ],
//   outroadDir: "right",
// };
// let car1: carInfo = {
//   id: 1,
//   roadDir: "left",
//   roadId: 1,
//   idOnRoad: 1,
//   zones: [
//     { col: 0, row: 0 },
//     { col: 1, row: 0 },
//     { col: 2, row: 0 },
//   ],
//   outroadDir: "top",
// };
// let car2: carInfo = {
//   id: 2,
//   roadDir: "left",
//   roadId: 1,
//   idOnRoad: 2,
//   zones: [
//     { col: 0, row: 0 },
//     { col: 1, row: 0 },
//     { col: 2, row: 0 },
//   ],
//   outroadDir: "top",
// };
// let car3: carInfo = {
//   id: 3,
//   roadDir: "left",
//   roadId: 1,
//   idOnRoad: 3,
//   zones: [
//     { col: 0, row: 0 },
//     { col: 1, row: 0 },
//     { col: 2, row: 0 },
//   ],
//   outroadDir: "top",
// };
// let car4: carInfo = {
//   id: 8,
//   roadDir: "top",
//   roadId: 1,
//   idOnRoad: 0,
//   zones: [
//     { col: 1, row: 0 },
//     { col: 2, row: 0 },
//   ],
//   outroadDir: "right",
// };
// let car5: carInfo = {
//   id: 9,
//   roadDir: "top",
//   roadId: 2,
//   idOnRoad: 0,
//   zones: [
//     { col: 2, row: 0 },
//   ],
//   outroadDir: "right",
// };

// cars.push(car);
// cars.push(car1);
// cars.push(car2);
// cars.push(car3);
// cars.push(car4);
// cars.push(car5);

// for(let i = 0;i < 20;i++){
//   let ans = getTimeMap(cars, numofcol, numofrow);
// }

