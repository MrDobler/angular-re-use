import { InMemoryDbService } from 'angular-in-memory-web-api';

import { Category } from './pages/categories/shared/category.model';
import { Entry } from './pages/entries/shared/entry.model';


export class InMemoryDatabase implements InMemoryDbService {
    createDb() {
        const categories: Category[] = [
            { id: 1, name: "Moradia", description: "Pagamentos de Contas da Casa." },
            { id: 2, name: "Saúde", description: "Plano de Saúde e Remédios." },
            { id: 3, name: "Lazer", description: "Cinema, parques, praia, etc." },
            { id: 4, name: "Salário", description: "Recebimento de salário." },
            { id: 5, name: "Freelas", description: "Trabalhos como Freelancer." }
        ];

        const entries: Entry[] = [
            { id: 1, name: 'Gás de Cozinha', category_id: categories[0].id, category: categories[0], paid: true, date: '14/09/2019', amount: "70.50", type: 'expense', description: ''  } as Entry,
            { id: 2, name: 'Suplementos', category_id: categories[1].id, category: categories[1], paid: false, date: '14/09/2019', amount: "15.00", type: 'expense', description: ''  } as Entry,
            { id: 3, name: 'Salário na Empresa X', category_id: categories[3].id, category: categories[3], paid: true, date: '15/09/2019', amount: "4500.00", type: 'revenue', description: ''  } as Entry,
            { id: 4, name: 'Aluguel de Filme', category_id: categories[2].id, category: categories[2], paid: true, date: '16/09/2019', amount: "15.00", type: 'expense', description: ''  } as Entry,
            { id: 5, name: 'Vídeo Game', category_id: categories[2].id, category: categories[2], paid: false, date: '14/09/2019', amount: "200.50", type: 'expense', description: ''  } as Entry,
            { id: 6, name: 'Uber/Táxi', category_id: categories[2].id, category: categories[2], paid: true, date: '20/09/2019', amount: "30.00", type: 'expense', description: ''  } as Entry,
            { id: 11, name: 'Pagamento Pelo Projeto Z', category_id: categories[4].id, category: categories[4], paid: true, date: '25/09/2019', amount: "2500.00", type: 'revenue', description: ''  } as Entry,
            { id: 12, name: 'Gunpla', category_id: categories[2].id, category: categories[2], paid: true, date: '14/09/2019', amount: "240.00", type: 'expense', description: ''  } as Entry,
            { id: 25, name: 'Vídeo Game', category_id: categories[2].id, category: categories[2], paid: false, date: '14/09/2019', amount: "35.00", type: 'expense', description: ''  } as Entry,
            { id: 26, name: 'Cinema', category_id: categories[2].id, category: categories[2], paid: true, date: '14/09/2019', amount: "25.00", type: 'expense', description: ''  } as Entry,
            { id: 30, name: 'Manutenção do Computador', category_id: categories[3].id, category: categories[3], paid: true, date: '14/09/2019', amount: "200.00", type: 'expense', description: ''  } as Entry
        ]

        return { categories, entries };
    }
}