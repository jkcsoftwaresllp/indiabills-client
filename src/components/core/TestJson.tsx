const TestJson = ({ data }: { data: object }) => {
    return (
        <pre>
            {JSON.stringify(data, null, 2)}
        </pre>
    )
}

export default TestJson;