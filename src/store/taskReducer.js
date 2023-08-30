import * as actionTypes from './actions';

export const initialState = {
    tasks: {
        recentTasks: [],
        todayTasks: [],
        total: 0
    },
    work: {
        started: false,
        ended: false,
        venue: "",
      },
};

const taskReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.RECENT_TASKS: {
            const recentTasks = action.payload;
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    recentTasks
                }
            };
        }
        case actionTypes.TODAY_TASKS: {
            const todayTasks = action.payload;
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    todayTasks
                }
            };
        }
        case actionTypes.TOTAL_TASKS: {
            const totalTasks = action.payload;
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    total: totalTasks
                }
            };
        }
        case actionTypes.WORK_STARTED: {
            const venue = action.payload;
            return {
              ...state,
              work: {
                ...state.work,
                started: true,
                venue,
              },
            };
          }
          case actionTypes.WORK_ENDED:
            return {
              ...state,
              work: {
                ...state.work,
                ended: true,
              },
            };
        default:
            return state;
    }
};

export default taskReducer;
