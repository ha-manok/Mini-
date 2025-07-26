export const instructions =  {
    tips:{
        title:'Tips & Guidelines',
        body:['Enter your Previous Cumulative credit hours accurately',
            'Enter semester credit hours accurately',
            'Enter Cumulative Weighted Average accurately',
            'Double-check your course grades before submitting'
        ],
        icon: require ('../assets/images/FRAME2.png')
    },
    calcTips:{
        title:' How it works',
        body:[
         {text:"Your current CWA is multiplied by your previous credit hours ", icon:'stats-chart-outline'},
         {text:"Add your expected grade points for current semester multiplied by semester credit hours",icon:'school-outline'},
         {text:"Divide by total credit hours {previous + semester credit hours} ", icon:'book-outline'}
      ]
    },
    calcInstructions:{
        title:'Tips for Improvement',
        body:[
            "Focus on higher credit courses for better CWA impact",
            "Maintain consistent performance across subjects",
            "Seek help early if struggling with any course "
        ],
    },
    carouselData:[
        require('../assets/images/FRAME2.png'),
        require('../assets/images/FRAME2.png'),
    ]
}