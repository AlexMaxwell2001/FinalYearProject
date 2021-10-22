const intialData = {
    tasks: {
        'task-1': { id: 'task-1', content: 'This is a button' },
        'task-2': { id: 'task-2', content: 'Text Box' },
        'task-3': { id: 'task-3', content: 'Hyperlink' },
        'task-4': { id: 'task-4', content: 'Image' }
    },
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'To do',
            taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
        },
    },
    columnOrder: ['column-1'],
};

export default intialData;