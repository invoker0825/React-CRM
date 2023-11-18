import './tag.scss';

const Tag = (props) => {

    const colors = {
        green : ['#E7F4EE', '#0D894F'],
        red : ['#FEEDEC', '#F04438'],
        orange : ['#FDF1E8', '#E46A11'],
        purple : ['#EFEFFD', '#5C59E8']
    }

    return (
        <div className='badge' style={{backgroundColor: colors[props.color][0], color: colors[props.color][1]}}>{props.label}</div>
    );
}

export default Tag;
