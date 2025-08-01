import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function UserEntriesTable() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { field: 'recipe_name', header: 'Recipe Name' },
    { field: 'name', header: 'Name' },
    { field: 'rating', header: 'Rating' },
    { field: 'image_url', header: 'Image' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('your_table_name')  // Replace with your table name
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setEntries(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const imageTemplate = (rowData) => {
    return rowData.image_url ? (
      <img src={rowData.image_url} alt="Preview" style={{ height: '60px' }} />
    ) : '—';
  };

  return (
    <div className="p-4">
      <h3 className="mb-3">My Entries</h3>
      <DataTable value={entries} loading={loading} paginator rows={5} tableStyle={{ minWidth: '50rem' }}>
        {columns.map(col => (
          <Column key={col.field} field={col.field} header={col.header}
            body={col.field === 'image_url' ? imageTemplate : null} />
        ))}
      </DataTable>
    </div>
  );
}