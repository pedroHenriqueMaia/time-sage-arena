import { ITeam } from "./ITeam";

export interface IGameData {
  homeTeam: ITeam;
  awayTeam: ITeam;
  quarter: number;
  attackTime: number;
  quarterTime: number;
}
