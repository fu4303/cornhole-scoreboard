// State //

export type Side = 'side1' | 'side2';
export type Team = 'teamA' | 'teamB';

export enum Color {
  RED = 'red',
  ORANGE = 'orange',
  YELLOW = 'yellow',
  OLIVE = 'olive',
  GREEN = 'green',
  TEAL = 'teal',
  BLUE = 'blue',
  VIOLET = 'violet',
  PURPLE = 'purple',
  PINK = 'pink',
  BROWN = 'brown',
  GREY = 'grey',
  BLACK = 'black',
}

export type PlayerVolley = {
  onBoard: number;
  inHole: number;
};

export type Volley = {
  throwingSide: Side;
  playerA: PlayerVolley;
  playerB: PlayerVolley;
};

export type State = {
  names: {
    side1: {
      teamA: string;
      teamB: string;
    };
    side2: {
      teamA: string;
      teamB: string;
    };
  };
  colors: {
    teamA: Color;
    teamB: Color;
  };
  volleys: Volley[];
  ephemeralVolley: Volley | null;
};

// Action types //

export const SET_PLAYER_NAME = 'SET_PLAYER_NAME';
export const SET_TEAM_COLOR = 'SET_TEAM_COLOR';
export const BEGIN_VOLLEY = 'BEGIN_VOLLEY';
export const UPDATE_VOLLEY = 'UPDATE_VOLLEY';
export const COMMIT_VOLLEY = 'COMMIT_VOLLEY';
export const CANCEL_VOLLEY = 'CANCEL_VOLLEY';

// Actions //

interface SetPlayerNameAction {
  type: typeof SET_PLAYER_NAME;
  side: Side;
  team: Team;
  name: string;
}

interface SetTeamColorAction {
  type: typeof SET_TEAM_COLOR;
  team: Team;
  color: Color;
}

interface BeginVolleyAction {
  type: typeof BEGIN_VOLLEY;
  side: Side;
}

interface UpdateVolleyAction {
  type: typeof UPDATE_VOLLEY;
  volley: Volley;
}

interface CommitVolleyAction {
  type: typeof COMMIT_VOLLEY;
}

interface CancelVolleyAction {
  type: typeof CANCEL_VOLLEY;
}

export type Action =
  | SetPlayerNameAction
  | SetTeamColorAction
  | BeginVolleyAction
  | UpdateVolleyAction
  | CommitVolleyAction
  | CancelVolleyAction;

// Action creators //

export function setPlayerName(side: Side, team: Team, name: string): Action {
  return {
    type: SET_PLAYER_NAME,
    side,
    team,
    name,
  };
}

export function setTeamColor(team: Team, color: Color): Action {
  return {
    type: SET_TEAM_COLOR,
    team,
    color,
  };
}

export function beginVolley(side: Side): Action {
  return {
    type: BEGIN_VOLLEY,
    side,
  };
}

export function updateVolley(volley: Volley): Action {
  return {
    type: UPDATE_VOLLEY,
    volley,
  };
}

export function commitVolley(): Action {
  return {
    type: COMMIT_VOLLEY,
  };
}

export function cancelVolley(): Action {
  return {
    type: CANCEL_VOLLEY,
  };
}

// Initial state //

export const initialState: State = {
  names: {
    side1: {
      teamA: '',
      teamB: '',
    },
    side2: {
      teamA: '',
      teamB: '',
    },
  },
  colors: {
    teamA: Color.BLUE,
    teamB: Color.GREY,
  },
  volleys: [],
  ephemeralVolley: null,
};

// Reducer //

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case SET_PLAYER_NAME:
      return {
        ...state,
        names: {
          ...state.names,
          [action.side]: {
            ...state.names[action.side],
            [action.team]: action.name,
          },
        },
      };
    case SET_TEAM_COLOR:
      return {
        ...state,
        colors: {
          ...state.colors,
          [action.team]: action.color,
        },
      };
    case BEGIN_VOLLEY:
      return {
        ...state,
        ephemeralVolley: {
          throwingSide: action.side,
          playerA: {
            onBoard: 0,
            inHole: 0,
          },
          playerB: {
            onBoard: 0,
            inHole: 0,
          },
        },
      };
    case UPDATE_VOLLEY:
      return {
        ...state,
        ephemeralVolley: action.volley,
      };
    case COMMIT_VOLLEY:
      if (state.ephemeralVolley !== null) {
        return {
          ...state,
          volleys: state.volleys.concat(state.ephemeralVolley),
          ephemeralVolley: null,
        };
      } else {
        return state;
      }
    case CANCEL_VOLLEY:
      return {
        ...state,
        ephemeralVolley: null,
      };
    default:
      return state;
  }
}

// Derived state //